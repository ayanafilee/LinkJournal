package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LinkJournal struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"`
	TopicID     primitive.ObjectID `bson:"topic_id" json:"topic_id"`
	Name        string             `bson:"name" json:"name"`
	Link        string             `bson:"link" json:"link"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	Screenshot  string             `bson:"screenshot,omitempty" json:"screenshot,omitempty"`
	IsImportant bool               `bson:"is_important" json:"is_important"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}