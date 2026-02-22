import { DateValue } from "@heroui/react";

export const ApifyAPI = {
    async runActor(actorId: string, input: object) {
        const response = await fetch(`/api/runApifyActor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ actorId, input }),
        });

        if (!response.ok) {
            throw new Error(`Failed to run actor: ${response.statusText}`);
        }

        const run = await response.json();
        return run.data;
    },

    async getDatasetItems(datasetId: string) {
        const response = await fetch(`/api/getApifyDataset?datasetId=${encodeURIComponent(datasetId)}`);

        if (!response.ok) {
            throw new Error(`Failed to get dataset: ${response.statusText}`);
        }

        return response.json();
    },

    async waitForRun(runId: string, actorId: string, maxWaitSeconds = 60) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitSeconds * 1000) {
            const response = await fetch(`/api/getApifyRun?actorId=${encodeURIComponent(actorId)}&runId=${encodeURIComponent(runId)}`);
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
        const response = await fetch(`/api/uploadImage`, {
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

// Types
export interface UserData {
    _id?: string;
    username: string;
    fullName?: string;
    url?: string;
    biography?: string;
    externalUrls?: string[];
    profilePicUrl?: string;
    profilePicUrlHD?: string;
    createdAt?: string;
    updatedAt?: string;
    isDraft?: boolean;
    socialLinks?: { type: string; url: string }[];
}

export interface PostData {
    _id?: string;
    shortCode: string;
    caption?: string;
    url?: string;
    displayUrl?: string;
    images?: string[];
    ownerUsername: string;
    ownerFullName?: string;
    ownerProfilePicUrl?: string;
    timestamp?: string;
    createdAt?: string;
    updatedAt?: string;
    dates?: EventDate | WorkshopDate | DateRange | null;
    type?: "event" | "workshop" | "calendar" | "draft";
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface EventDate {
  dates: DateValue[];
}

export interface WorkshopDate {
  workshopDays: string[];
  until: DateValue | null;
  every: number;
}

export interface DateRange {
  dateRange: { start: DateValue | null; end: DateValue | null };
}

// Cosmos DB API for user and event management
export const CosmosAPI = {
    /**
     * Insert or update a user in the database
     */
    async insertUser(userData: UserData): Promise<{ success: boolean; username: string; posts?: { created: number; updated: number } }> {
        // Try to upload profile image to Azure Storage (optional - may fail due to Instagram rate limits)
        if (userData.profilePicUrl) {
            try {
                const filename = `${userData.username}_profile.jpg`;
                const newImageUrl = await AzureStorageAPI.uploadImageFromUrl(userData.profilePicUrl, filename);
                userData.profilePicUrl = newImageUrl;
            } catch (err) {
                console.warn("Failed to upload profile image, using original URL:", err);
            }
        }
        if (userData.profilePicUrlHD) {
            try {
                const filenameHD = `${userData.username}_hd_profile.jpg`;
                const newImageUrlHD = await AzureStorageAPI.uploadImageFromUrl(userData.profilePicUrlHD, filenameHD);
                userData.profilePicUrlHD = newImageUrlHD;
            } catch (err) {
                console.warn("Failed to upload HD profile image, using original URL:", err);
            }
        }

        const response = await fetch(`/api/insertUser`, {
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

        return response.json();
    },

    /**
     * Get a user by username
     */
    async getUser(username: string): Promise<UserData | null> {
        const response = await fetch(`/api/getUser?username=${encodeURIComponent(username)}`, {
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
    },

    /**
     * Insert or update an event/post (upsert)
     */
    async insertEvent(eventData: PostData): Promise<{ success: boolean; shortCode: string; isNew?: boolean }> {
        const response = await fetch(`/api/insertEvent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to insert event");
        }

        return response.json();
    },

    /**
     * Get a single event by shortCode
     */
    async getEvent(shortCode: string): Promise<PostData | null> {
        const response = await fetch(`/api/getEvent?shortCode=${encodeURIComponent(shortCode)}`, {
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
            throw new Error(error.error || "Failed to get event");
        }

        return response.json();
    },

    /**
     * Get paginated events/posts
     */
    async getEvents(options: {
        page?: number;
        limit?: number;
        ownerUsername?: string;
    } = {}): Promise<PaginatedResponse<PostData>> {
        const params = new URLSearchParams();
        if (options.page) params.append("page", options.page.toString());
        if (options.limit) params.append("limit", options.limit.toString());
        if (options.ownerUsername) params.append("ownerUsername", options.ownerUsername);

        const response = await fetch(`/api/getEvents?${params.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to get events");
        }

        return response.json();
    }
};

/**
 * Create a user from Instagram username
 * First checks if user exists in database, if not fetches from Apify and inserts
 */
export const createUser = async (username: string): Promise<UserData> => {
    // First check if user already exists
    const existingUser = await CosmosAPI.getUser(username);
    if (existingUser) {
        return existingUser;
    }

    // If not found, run Apify actor to get user data
    const input = {
        "usernames": [username],
        "resultsLimit": 1
    };

    const run = await ApifyAPI.runActor("dSCLg0C3YEZ83HzYX", input);
    const completedRun = await ApifyAPI.waitForRun(run.id, "dSCLg0C3YEZ83HzYX", 120);
    const datasetItems = await ApifyAPI.getDatasetItems(completedRun.defaultDatasetId);
    
    if (datasetItems.length === 0) {
        throw new Error("No user data found from Apify actor");
    }

    const userData = datasetItems[0];
    
    // Map Apify response to our UserData structure (no posts)
    const userToInsert: UserData = {
        username: userData.username,
        fullName: userData.fullName,
        url: userData.url,
        biography: userData.biography,
        externalUrls: userData.externalUrls || [],
        profilePicUrl: userData.profilePicUrl,
        profilePicUrlHD: userData.profilePicUrlHD,
        isDraft: true
    };

    const result = await CosmosAPI.insertUser(userToInsert);

    if (!result.success) {
        throw new Error("Error inserting user into database");
    }

    // Return the user data we inserted
    return userToInsert;
};

export const updateUser = async (userData: UserData): Promise<UserData> => {
    const result = await CosmosAPI.insertUser(userData);

    if (!result.success) {
        throw new Error("Error updating user in database");
    }

    return userData;
}

export const createPost = async (IgLink: string): Promise<PostData> => {
    // Extract shortcode from Instagram link
    const match = IgLink.match(/instagram\.com\/p\/([a-zA-Z0-9_-]+)/);
    if (!match || match.length < 2) {
        throw new Error("Invalid Instagram link");
    }
    const shortCode = match[1];

    // Run Apify instagram-scraper with directUrls
    const cleanUrl = `https://www.instagram.com/p/${shortCode}/`;
    const input = {
        "directUrls": [cleanUrl],
        "resultsLimit": 1
    };

    const run = await ApifyAPI.runActor("shu8hvrXbJbY3Eb9W", input);
    const completedRun = await ApifyAPI.waitForRun(run.id, "shu8hvrXbJbY3Eb9W", 120);
    const datasetItems = await ApifyAPI.getDatasetItems(completedRun.defaultDatasetId);
    
    if (datasetItems.length === 0) {
        throw new Error("No post data found from Apify actor");
    }

    const postData = datasetItems[0]

    // store images in Azure Blob Storage
    let imageUrls: string[] = [];
    
    // Collect all image URLs - displayUrl first, then any additional images
    let allImageUrls: string[] = [];
    if (postData.images && postData.images.length > 0) {
        allImageUrls.push(...postData.images);
    }
    
    // Upload all images to Azure Blob Storage
    if (allImageUrls.length > 0) {
        const uploadPromises = allImageUrls.map((imgUrl: string, index: number) => {
            const filename = `${shortCode}_image_${index + 1}.jpg`;
            return AzureStorageAPI.uploadImageFromUrl(imgUrl, filename);
        });
        imageUrls = await Promise.all(uploadPromises);
    } else {
        // If no images array, at least try to upload the displayUrl
        if (postData.displayUrl) {
            const filename = `${shortCode}_image_1.jpg`;
            const uploadedUrl = await AzureStorageAPI.uploadImageFromUrl(postData.displayUrl, filename);
            imageUrls.push(uploadedUrl);
        }
    }

    // get username profile picture
    let ownerProfilePicUrl = "";
    try {
        const ownerData = await createUser(postData.ownerUsername);
        ownerProfilePicUrl = ownerData.profilePicUrl || "";
    } catch (err) {
        console.warn("Failed to get owner profile picture:", err);
    }

    // Map Apify response to our PostData structure
    const postToInsert: PostData = {
        shortCode: postData.shortCode,
        caption: postData.caption,
        url: postData.url,
        displayUrl: imageUrls[0] || postData.displayUrl, // Use uploaded URL if available
        images: imageUrls, // Use uploaded Azure URLs
        ownerUsername: postData.ownerUsername,
        ownerFullName: postData.ownerFullName,
        ownerProfilePicUrl: ownerProfilePicUrl,
        timestamp: postData.timestamp,
        type: "draft"

    };

    const result = await CosmosAPI.insertEvent(postToInsert);

    if (!result.success) {
        throw new Error("Error inserting post into database");
    }

    // Return the post data we inserted
    return postToInsert;
}

export const updatePost = async (postData: PostData): Promise<PostData> => {
    const result = await CosmosAPI.insertEvent(postData);

    if (!result.success) {
        throw new Error("Error updating post in database");
    }

    return postData;
}