package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth" // <--- IMPORTANT: Add this import
	"google.golang.org/api/option"
)

// Global Variables
var FirebaseApp *firebase.App
var AuthClient *auth.Client // <--- IMPORTANT: New global variable

func InitFirebase() {
	// Load your service account file
	opt := option.WithCredentialsFile("firebase-admin.json")

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("🔥 Firebase init error: %v", err)
	}

	FirebaseApp = app

	// Initialize Auth Client HERE (Once, at startup)
	// This ensures we catch errors immediately when the server starts
	client, err := app.Auth(context.Background())
	if err != nil {
		log.Fatalf("🔥 Error creating Firebase Auth client: %v", err)
	}

	AuthClient = client
	log.Println("✅ Firebase Auth Client initialized")
}

// This does two things:

// ✔ Loads your Firebase project credentials
// ✔ Creates a global AuthClient that can verify tokens

// This is like your backend being able to "ask Firebase" if a token is valid.