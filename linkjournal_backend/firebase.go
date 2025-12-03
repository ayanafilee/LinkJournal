package main

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

// Global Variables
var FirebaseApp *firebase.App
var AuthClient *auth.Client

func InitFirebase() {
	// Load service account JSON from environment variable
	cred := os.Getenv("FIREBASE_SERVICE_ACCOUNT")
	if cred == "" {
		log.Fatalf("🔥 FIREBASE_SERVICE_ACCOUNT is missing in environment variables")
	}

	// Convert JSON string into credentials
	opt := option.WithCredentialsJSON([]byte(cred))

	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("🔥 Firebase init error: %v", err)
	}

	FirebaseApp = app

	// Initialize Auth Client
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