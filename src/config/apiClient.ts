// Apify REST API client for browser
const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN;
const APIFY_BASE_URL = "https://api.apify.com/v2";

// Azure Function URL for image uploads
const AZURE_FUNCTION_URL = import.meta.env.VITE_AZURE_FUNCTION_URL || "";

export const ApifyAPI = {
    async runActor(actorId: string, input: object) {
        const response = await fetch(`${APIFY_BASE_URL}/acts/${actorId}/runs?token=${APIFY_TOKEN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });

        if (!response.ok) {
            throw new Error(`Failed to run actor: ${response.statusText}`);
        }

        const run = await response.json();
        return run.data;
    },

    async getDatasetItems(datasetId: string) {
        const response = await fetch(`${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${APIFY_TOKEN}`);

        if (!response.ok) {
            throw new Error(`Failed to get dataset: ${response.statusText}`);
        }

        return response.json();
    },

    async waitForRun(runId: string, actorId: string, maxWaitSeconds = 60) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitSeconds * 1000) {
            const response = await fetch(`${APIFY_BASE_URL}/acts/${actorId}/runs/${runId}?token=${APIFY_TOKEN}`);
            const data = await response.json();
            
            if (data.data.status === "SUCCEEDED") {
                return data.data;
            } else if (data.data.status === "FAILED" || data.data.status === "ABORTED") {
                throw new Error(`Actor run ${data.data.status}`);
            }
            
            // Wait 2 seconds before polling again
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        throw new Error("Timeout waiting for actor run");
    }
};

// Azure Storage API for uploading images
export const AzureStorageAPI = {
    /**
     * Upload an image from a URL to Azure Blob Storage via Azure Function
     * @param imageUrl - The source image URL (e.g., Instagram CDN URL)
     * @param filename - The desired filename for the blob
     * @returns The new Azure Blob Storage URL
     */
    async uploadImageFromUrl(imageUrl: string, filename: string): Promise<string> {
        if (!AZURE_FUNCTION_URL) {
            throw new Error("Azure Function URL not configured. Set VITE_AZURE_FUNCTION_URL in .env.local");
        }

        const response = await fetch(`${AZURE_FUNCTION_URL}/api/uploadImage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl, filename }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to upload image");
        }

        const result = await response.json();
        return result.url;
    },

    /**
     * Upload multiple images and return their new URLs
     * @param images - Array of { url, filename } objects
     * @returns Array of new Azure Blob Storage URLs
     */
    async uploadMultipleImages(images: { url: string; filename: string }[]): Promise<string[]> {
        const uploads = images.map(img => 
            this.uploadImageFromUrl(img.url, img.filename)
        );
        return Promise.all(uploads);
    }
};

// Kusto API for user management
export const KustoAPI = {
    /**
     * Insert a user into the RawUsers table in Azure Data Explorer
     */
    async insertUser(userData: {
        id?: string;
        username: string;
        fullName?: string;
        profilePicUrl?: string;
        profilePicUrlHD?: string;
        biography?: string;
        latestPosts?: object[];
    }): Promise<{ success: boolean; id: string, userObject: typeof userData }> {
        if (!AZURE_FUNCTION_URL) {
            throw new Error("Azure Function URL not configured. Set VITE_AZURE_FUNCTION_URL in .env.local");
        }

        // Try to upload profile image to Azure Storage (optional - may fail due to Instagram rate limits)
        if (userData.profilePicUrl) {
            try {
                const filename = `${userData.username}_${userData.id}.jpg`;
                const newImageUrl = await AzureStorageAPI.uploadImageFromUrl(userData.profilePicUrl, filename);
                userData.profilePicUrl = newImageUrl;
            } catch (err) {
                console.warn("Failed to upload profile image, using original URL:", err);
                // Keep the original Instagram URL (will expire eventually)
            }
        }
        if (userData.profilePicUrlHD) {
            try {
                const filenameHD = `${userData.username}_hd_${userData.id}.jpg`;
                const newImageUrlHD = await AzureStorageAPI.uploadImageFromUrl(userData.profilePicUrlHD, filenameHD);
                userData.profilePicUrlHD = newImageUrlHD;
            } catch (err) {
                console.warn("Failed to upload HD profile image, using original URL:", err);
                // Keep the original Instagram URL (will expire eventually)
            }
        }

        const response = await fetch(`${AZURE_FUNCTION_URL}/api/insertUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to insert user");
        }

        return {
            ...(await response.json()),
            userObject: userData
        }
    },

    /**
     * Get a user by username from the RawUsers table
     */
    async getUser(username: string): Promise<{
        Id: string;
        username: string;
        fullName: string;
        profilePicUrl: string;
        profilePicUrlHD: string;
        biography: string;
        latestPosts: object[];
    } | null> {
        if (!AZURE_FUNCTION_URL) {
            throw new Error("Azure Function URL not configured. Set VITE_AZURE_FUNCTION_URL in .env.local");
        }

        const response = await fetch(`${AZURE_FUNCTION_URL}/api/getUser?username=${encodeURIComponent(username)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to get user");
        }

        return response.json();
    }
};

export const createUser =
// first, check if it already exists in Kusto
// if not, get info from apify and insert into Kusto
async (username: string) => {
    let user = await KustoAPI.getUser(username);
    if (user) {
        return user;
    }

    // If not found, run Apify actor to get user data
    const input = {
        "username": username,
        "includePosts": true,
        "includeAboutSection": false
    };

    const run = await ApifyAPI.runActor("dSCLg0C3YEZ83HzYX", input);
    const completedRun = await ApifyAPI.waitForRun(run.id, "dSCLg0C3YEZ83HzYX", 120);
    const datasetItems = await ApifyAPI.getDatasetItems(completedRun.defaultDatasetId);
    if (datasetItems.length === 0) {
        throw new Error("No user data found from Apify actor");
    }

    const userData = datasetItems[0];
    const { id, username: usr, fullName, profilePicUrl, profilePicUrlHD, biography, latestPosts } = userData;

    const { success, userObject } = await KustoAPI.insertUser({id, username: usr, fullName, profilePicUrl, profilePicUrlHD, biography, latestPosts});

    if (!success) {
        throw new Error("Error inserting user into database");
    }

    return userObject;
};