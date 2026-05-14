import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// ---------- Domain types (Cosmos schema v2) ----------

export type PostStatus = "draft" | "pending" | "published" | "dismissed";
export type PostType = "event" | "workshop" | "calendar";
export type PostSource = "instagram" | "manual" | "auto-detected";

export type UserStatus = "draft" | "pending" | "approved" | "rejected";

/** Lightweight owner snapshot returned by the API (joined from the users collection). */
export interface OwnerRef {
  username: string;
  fullName?: string;
  profilePicUrl?: string;
}

export interface PostData {
  _id?: string;                  // === shortCode; optional client-side, set server-side
  shortCode: string;             // required
  ownerUsername: string;         // required (FK to UserData._id)

  // content
  caption?: string;
  url?: string;                  // IG permalink, only when source === "instagram"
  images: string[];              // required; first item is the primary
  taggedUsers: string[];         // always present, default []

  // event metadata
  dates: string[] | null;        // always present (null if unknown), never undefined
  type: PostType;                // date-pattern only

  // state
  status: PostStatus;            // single source of truth for lifecycle
  source: PostSource;

  // timestamps (ISO 8601 strings)
  createdAt: string;
  updatedAt: string;
  timestamp?: string;            // original IG post timestamp, only when applicable

  // joined on read by the API; never written
  owner?: OwnerRef | null;
}

export interface UserData {
  _id?: string;                  // === username
  username: string;              // required

  fullName?: string;
  profilePicUrl?: string;
  url?: string;
  biography?: string;
  externalUrls: string[];        // always present, default []
  private: boolean;              // always present

  status: UserStatus;            // replaces isDraft + isApproved
  autoDetectEnabled: boolean;    // always present, default false
  lastScrapedPostId?: string;

  createdAt: string;             // ISO
  updatedAt: string;             // ISO
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
