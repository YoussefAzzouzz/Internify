package com.example.gestiondocuments.Services;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AITestGenerationService {

    @Value("${azure.openai.api.key}")
    private String openAiApiKey;

    @Value("${azure.openai.endpoint}")
    private String azureEndpoint;

    /**
     * Génère des tests unitaires pour une classe Java donnée
     */
    public String generateUnitTests(String sourceCode, String className, String testFramework) {
        String prompt = String.format("""
Tu es un expert en test logiciel et en développement Java.
Génère des tests unitaires complets et pertinents pour la classe suivante.

Framework de test à utiliser : %s

Exigences :
- Couvre tous les cas normaux (happy path)
- Couvre les cas limites (edge cases)
- Couvre les cas d'erreur (exception handling)
- Utilise des assertions claires et précises
- Ajoute des commentaires explicatifs pour chaque test
- Nomme les tests selon la convention : should_ExpectedBehavior_When_StateUnderTest
- Utilise des mocks si nécessaire (Mockito)
- Teste au minimum 80%% de couverture de code

Classe à tester :
```java
%s
```

Génère uniquement le code de la classe de test, sans explications supplémentaires.
""", testFramework, sourceCode);

        return callAzureOpenAI(prompt, "system_test_generator");
    }

    /**
     * Génère des tests d'intégration pour un endpoint REST
     */
    public String generateIntegrationTests(String controllerCode, String endpointPath) {
        String prompt = String.format("""
Tu es un expert en test d'intégration et API REST.
Génère des tests d'intégration complets pour le contrôleur REST suivant.

Exigences :
- Utilise Spring Boot Test (@SpringBootTest)
- Utilise MockMvc pour tester les endpoints
- Teste tous les codes de statut HTTP possibles (200, 400, 404, 500, etc.)
- Teste la validation des données d'entrée
- Teste les réponses JSON
- Teste l'authentification/autorisation si présente
- Utilise @MockBean pour les dépendances
- Ajoute des données de test réalistes

Endpoint à tester : %s

Code du contrôleur :
```java
%s
```

Génère uniquement le code de la classe de test d'intégration.
""", endpointPath, controllerCode);

        return callAzureOpenAI(prompt, "system_integration_tester");
    }

    /**
     * Génère des tests fonctionnels E2E (End-to-End)
     */
    public String generateE2ETests(String featureDescription, String userStories) {
        String prompt = String.format("""
Tu es un expert en tests fonctionnels et automatisation E2E avec Selenium/Cypress.
Génère des scénarios de tests fonctionnels complets basés sur les user stories.

Exigences :
- Format Gherkin (Given/When/Then) pour chaque scénario
- Couvre tous les flux utilisateur principaux
- Couvre les cas d'erreur utilisateur
- Teste les validations côté client
- Teste la navigation et l'UX
- Teste la compatibilité mobile si applicable
- Ajoute des assertions visuelles si nécessaire

Fonctionnalité : %s

User Stories :
%s

Génère les scénarios au format Gherkin + le code Selenium Java pour automatiser ces tests.
""", featureDescription, userStories);

        return callAzureOpenAI(prompt, "system_e2e_tester");
    }

    /**
     * Analyse du code source pour détecter les bugs potentiels
     */
    public String analyzeCodeForBugs(String sourceCode, String language) {
        String prompt = String.format("""
Tu es un expert en analyse statique de code et détection de bugs.
Analyse le code suivant et identifie tous les problèmes potentiels.

Vérifie :
- Bugs logiques
- Fuites mémoire
- Problèmes de concurrence (race conditions, deadlocks)
- Vulnérabilités de sécurité (injection SQL, XSS, etc.)
- Mauvaises pratiques
- Code smell et anti-patterns
- Problèmes de performance
- Gestion incorrecte des exceptions

Code à analyser (%s) :
```
%s
```

Format de réponse :
Pour chaque problème identifié :
1. 🔴 Sévérité (Critique/Haute/Moyenne/Basse)
2. 📍 Localisation (ligne de code)
3. 🐛 Description du problème
4. ✅ Solution recommandée
5. 💡 Exemple de code corrigé

Si aucun problème n'est trouvé, indique que le code est conforme aux bonnes pratiques.
""", language, sourceCode);

        return callAzureOpenAI(prompt, "system_code_analyzer");
    }

    /**
     * Génère des données de test réalistes
     */
    public String generateTestData(String entityClass, int numberOfRecords, String dataType) {
        String prompt = String.format("""
Tu es un expert en génération de données de test.
Génère %d enregistrements de données de test réalistes pour l'entité suivante.

Type de données : %s (valides/invalides/limites)

Entité :
```java
%s
```

Exigences :
- Données réalistes et cohérentes
- Respecte les contraintes de validation (@NotNull, @Size, @Email, etc.)
- Varie les cas (normaux, limites, edge cases)
- Format JSON pour faciliter l'import
- Ajoute des relations si l'entité en a

Génère un tableau JSON de données de test.
""", numberOfRecords, dataType, entityClass);

        return callAzureOpenAI(prompt, "system_data_generator");
    }

    /**
     * Valide la couverture de code et suggère des tests manquants
     */
    public String analyzeCoverageAndSuggestTests(String sourceCode, String existingTests, double currentCoverage) {
        String prompt = String.format("""
Tu es un expert en couverture de code et qualité logicielle.

Couverture actuelle : %.2f%%
Objectif : 80%% minimum

Code source :
```java
%s
```

Tests existants :
```java
%s
```

Mission :
1. Identifie les branches de code non couvertes
2. Identifie les méthodes non testées
3. Identifie les cas d'erreur non testés
4. Génère les tests manquants pour atteindre 80%% de couverture
5. Priorise les tests par criticité

Format de réponse :
- Liste des zones non couvertes
- Tests prioritaires à ajouter (code complet)
- Estimation de l'amélioration de couverture
""", currentCoverage, sourceCode, existingTests);

        return callAzureOpenAI(prompt, "system_coverage_analyzer");
    }

    /**
     * Génère un rapport de validation logicielle complet
     */
    public String generateValidationReport(String projectName, String testResults, String codeAnalysis) {
        String prompt = String.format("""
Tu es un expert QA et tu dois générer un rapport de validation logicielle professionnel.

Projet : %s

Résultats des tests :
%s

Analyse du code :
%s

Génère un rapport structuré comprenant :

1. 📊 RÉSUMÉ EXÉCUTIF
   - Statut global de la qualité (PASS/FAIL)
   - Score de qualité sur 100
   - Recommandations prioritaires

2. 🧪 RÉSULTATS DES TESTS
   - Tests unitaires (nombre, taux de réussite, couverture)
   - Tests d'intégration
   - Tests E2E
   - Tests de performance

3. 🐛 ANALYSE DES BUGS
   - Bugs critiques trouvés
   - Bugs non-bloquants
   - Code smells

4. 🎯 COUVERTURE DE CODE
   - Taux de couverture par module
   - Zones à risque (faible couverture)

5. 🔒 SÉCURITÉ
   - Vulnérabilités détectées
   - Niveau de risque

6. 📈 MÉTRIQUES DE QUALITÉ
   - Complexité cyclomatique
   - Dette technique
   - Maintenabilité

7. ✅ RECOMMANDATIONS
   - Actions prioritaires
   - Actions moyen terme
   - Bonnes pratiques à adopter

Format : Markdown professionnel avec emojis et graphiques textuels.
""", projectName, testResults, codeAnalysis);

        return callAzureOpenAI(prompt, "system_qa_reporter");
    }

    /**
     * Génère des tests de performance/charge
     */
    public String generatePerformanceTests(String apiEndpoints, int expectedLoad) {
        String prompt = String.format("""
Tu es un expert en tests de performance et JMeter/Gatling.
Génère des scénarios de tests de charge pour les endpoints suivants.

Charge attendue : %d requêtes/seconde

Endpoints :
%s

Exigences :
- Scénarios de montée en charge progressive
- Tests de stress (au-delà de la capacité)
- Tests d'endurance (longue durée)
- Identifie les goulots d'étranglement potentiels
- Définit les KPIs à mesurer (temps de réponse, throughput, etc.)
- Génère le code JMeter (format JMX) ou Gatling (Scala)

Inclus aussi les assertions de performance :
- Temps de réponse P95 < 500ms
- Temps de réponse P99 < 1000ms
- Taux d'erreur < 1%%
""", expectedLoad, apiEndpoints);

        return callAzureOpenAI(prompt, "system_performance_tester");
    }

    /**
     * Appel générique à Azure OpenAI
     */
    private String callAzureOpenAI(String prompt, String systemRole) {
        try {
            String systemMessage = switch (systemRole) {
                case "system_test_generator" -> 
                    "Tu es un expert en test logiciel avec 15 ans d'expérience. Tu génères des tests de haute qualité, complets et maintenables.";
                case "system_integration_tester" -> 
                    "Tu es un expert en tests d'intégration et architecture logicielle.";
                case "system_e2e_tester" -> 
                    "Tu es un expert en tests fonctionnels et automatisation E2E.";
                case "system_code_analyzer" -> 
                    "Tu es un expert en analyse statique de code et sécurité logicielle.";
                case "system_data_generator" -> 
                    "Tu es un expert en génération de données de test et qualité des données.";
                case "system_coverage_analyzer" -> 
                    "Tu es un expert en couverture de code et métriques de qualité.";
                case "system_qa_reporter" -> 
                    "Tu es un QA Lead qui rédige des rapports professionnels pour la direction.";
                case "system_performance_tester" -> 
                    "Tu es un expert en tests de performance et optimisation système.";
                default -> "Tu es un assistant IA expert en ingénierie logicielle.";
            };

            String requestBody = String.format("""
            {
              "messages": [
                {"role": "system", "content": "%s"},
                {"role": "user", "content": "%s"}
              ],
              "temperature": 0.7,
              "max_tokens": 4000
            }
            """, 
            systemMessage.replace("\"", "\\\"").replace("\n", "\\n"),
            prompt.replace("\"", "\\\"").replace("\n", "\\n"));

            HttpURLConnection connection = (HttpURLConnection) new URL(azureEndpoint).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            connection.setRequestProperty("api-key", openAiApiKey);
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                os.write(requestBody.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }

            JSONObject jsonResponse = new JSONObject(response.toString());
            return jsonResponse
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content");

        } catch (Exception e) {
            e.printStackTrace();
            return "Erreur lors de l'appel à l'IA : " + e.getMessage();
        }
    }

    /**
     * Sauvegarde les tests générés dans un fichier
     */
    public void saveGeneratedTests(String testCode, String outputPath) throws IOException {
        Files.writeString(Path.of(outputPath), testCode, StandardCharsets.UTF_8);
    }
}