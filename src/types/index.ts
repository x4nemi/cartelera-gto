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

/** AI-extracted suggestions for a post. Each field is optional and may be edited or rejected by the user. */
export interface AISuggestions {
  title?: string | null;
  tags?: string[];
  location?: string | null;
  price?: string | null;
  eventType?: PostType | null;
  /** 0.0–1.0 per field, mirrors the suggestion shape. */
  confidence?: Partial<Record<"title" | "tags" | "location" | "price" | "eventType", number>>;
  /** ISO timestamp of when the extraction ran. */
  extractedAt?: string;
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
  /** Explicit end date (ISO) when the post states one for a recurring schedule; null otherwise. */
  endsOn?: string | null;

  // user-editable AI-assisted fields (any of these may have been suggested by AI then accepted/edited)
  title?: string;
  tags?: string[];
  location?: string;
  price?: string;

  /** Raw AI output kept for reference / re-suggestion; never shown directly when the user has saved their own values. */
  aiSuggestions?: AISuggestions | null;

  /** AI judgment on whether this post is actually an event. Drives the publish gate. */
  aiVerdict?: {
    isEvent: boolean;
    confidence: number;       // 0..1
    reason?: string | null;   // short Spanish sentence; shown in gate + admin queue
    model: string;            // e.g. "gpt-4o-mini" — for future debugging
    evaluatedAt: string;      // ISO timestamp
  } | null;

  /** Admin who approved/rejected a pending post. */
  reviewedBy?: string;
  reviewedAt?: string;

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
