# Firestore Security Rules for DentaScan

## Important: Must be configured in Firebase Console

These security rules ensure:
- ✅ Users can only read/write their own scan data
- ✅ Authentication is required
- ✅ No public access to anyone's scans

## How to Configure

1. Go to **Firebase Console** → **dentascan-20cea**
2. Select **Firestore Database**
3. Go to **Rules** tab
4. Replace the entire rules with the code below:
5. Click **Publish**

---

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own scans
    match /users/{uid}/scans/{scanId} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explanation

- `request.auth.uid == uid`: Only the authenticated user can access their own scans
- `scanId` can be any document in their `scans` subcollection
- All other collections are denied by default
- No public read access
- No anonymous access (requires Firebase Authentication)

## Testing Rules

After publishing, test in Firebase Console:

1. Go to **Firestore** → **Data**
2. Try to read `users/{someoneElseUID}/scans`
3. Should fail with: `"Missing or insufficient permissions"`

---

## After Publishing Rules

Firestore is now secure for production use. Users can ONLY access their own scan history.

Cross-platform sync now works:
- Android creates scan → Saved to `users/{firebaseUID}/scans/{scanId}`
- Website logs in with same account → Reads from `users/{firebaseUID}/scans/*`
- Both see the same data
