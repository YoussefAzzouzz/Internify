# Internify

## Projet Internify par Yassine Hmedi

**Internify** est une plateforme intelligente d'opportunités de stage et d'emploi, inspirée de LinkedIn, mais adaptée aux besoins spécifiques des étudiants, jeunes diplômés, et entreprises. Elle facilite la **mise en relation**, la **communication**, et la **gestion des candidatures** dans un espace numérique sécurisé et intelligent.

---

## ⚙️ Fonctionnalités principales

### 🔐 Authentification & Sécurité

- **Authentification à deux facteurs (2FA)** pour une sécurité renforcée
- **Détection d'anomalies en temps réel** : Un modèle d'IA analyse les tentatives de connexion en se basant sur :
  - La localisation géographique
  - L'adresse IP
  - Les patterns de comportement
- **Système d'alerte intelligent** pour les connexions suspectes

### 👤 Gestion des utilisateurs (CRUD)

- Création, lecture, mise à jour et suppression de profils utilisateurs
- Gestion complète des comptes étudiants et entreprises
- Système de rôles et permissions

### 🎯 Personnalisation de profil

- Profils détaillés et personnalisables


### 🤖 Intelligence Artificielle

- **Modèle LLM** pour l'analyse comportementale des connexions
- **Détection d'anomalies** basée sur :
  - Historique de connexion
  - Géolocalisation
  - Adresse IP
  - Patterns temporels

---

## 🛠️ Technologies utilisées

### Backend
- **Spring Boot** - Framework principal pour le développement de l'API REST
- **Spring Security** - Gestion de l'authentification et des autorisations
- **Spring Data JPA** - Couche d'accès aux données

### Frontend
- **Angular** - Framework pour le développement de l'interface utilisateur
- **TypeScript** - Langage de programmation
- **Angular Material** - Composants UI

### Base de données
- **MySQL** - Système de gestion de base de données relationnelle

### Intelligence Artificielle
- **LLM (Large Language Model)** - Analyse des tentatives de connexion et détection d'anomalies

### APIs externes
- **API de géolocalisation IP** - Pour vérifier la localisation des connexions
- **API 2FA** - Service d'authentification à deux facteurs

---

## 🚀 Installation

### Prérequis
```bash
