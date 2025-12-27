
# Cahier des Charges : Sécurité & Infrastructure BOMOKO

## 1. Règles de Sécurité Firestore (À COPIER DANS FIREBASE)

**IMPORTANT** : Remplacez vos règles actuelles par celles-ci. Elles permettent la recherche par email et sécurisent les messages sans dépendances circulaires.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuth() {
      return request.auth != null;
    }

    match /users/{userId} {
      // Autoriser la lecture pour la recherche par email et l'affichage des profils
      allow read: if isAuth();
      allow write: if isAuth() && request.auth.uid == userId;
    }
    
    match /chats/{chatId} {
      allow read: if isAuth() && request.auth.uid in resource.data.participants;
      allow create: if isAuth() && request.auth.uid in request.resource.data.participants;
      allow update: if isAuth() && request.auth.uid in resource.data.participants;
      
      match /messages/{messageId} {
        // Règle simplifiée : si l'ID du chat contient l'UID de l'utilisateur, il peut lire
        // Cela évite l'erreur de permission si le document chat parent est vide ou en création
        allow read: if isAuth() && chatId.matches('.*' + request.auth.uid + '.*');
        allow create: if isAuth() && request.resource.data.senderId == request.auth.uid;
      }
    }

    match /trainings/{trainingId} {
      allow read: if true; 
      allow write: if isAuth(); 
    }

    match /jobs/{jobId} {
      allow read: if true;
      allow write: if isAuth();
    }

    match /koop/{itemId} {
      allow read: if true;
      allow write: if isAuth();
    }
  }
}
```

## 2. Structure des Collections
- **users** : Indexé par UID. Contient `email`, `firstname`, `name`, `avatar`, `lastSeen`.
- **chats** : Indexé par `uid1_uid2` (trié par ordre alphabétique).
- **messages** : Sous-collection de `chats`.
