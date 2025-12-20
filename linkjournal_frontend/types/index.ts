// types/index.ts

// Maps to Go's primitive.ObjectID, which is a string in JSON
export type ObjectId = string;

/**
 * Topic Model (Go: Topic struct)
 */
export interface Topic {
  id: ObjectId;
  user_id: string;      // Firebase UID
  name: string;
  created_at: string;   // time.Time serialized as string
}

/**
 * LinkJournal Model (Go: LinkJournal struct)
 */
export interface LinkJournal {
  id: ObjectId;
  user_id: string;
  topic_id: ObjectId;
  name: string;
  link: string;
  description?: string; // matches 'omitempty' in Go struct
  screenshot?: string;  // matches 'omitempty' in Go struct
  is_important: boolean;
  created_at: string;
}


export interface User {
    id?: string;
    firebase_uid: string;
    email: string;
    display_name: string;
    profile_picture: string;
    created_at?: string;
}
/**
 * Request Body Types
 */
export type CreateTopicRequest = Pick<Topic, 'name'>;

export type CreateJournalRequest = Pick<LinkJournal, 'topic_id' | 'name' | 'link'> &
  Partial<Pick<LinkJournal, 'description' | 'screenshot'>>;

// Updates can include any field except IDs and user_id, as per your UpdateJournal controller
export type UpdateJournalRequest = Partial<Omit<LinkJournal, 'id' | 'user_id' | 'created_at'>>;