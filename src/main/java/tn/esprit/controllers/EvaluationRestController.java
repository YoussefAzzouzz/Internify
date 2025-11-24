package tn.esprit.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Evaluation;
import tn.esprit.services.IEvaluationService;

import java.util.List;

@Tag(name="Evaluations Management")
@RestController
@AllArgsConstructor
@RequestMapping("/api/evaluations")
@CrossOrigin(origins = "http://localhost:4200")
public class EvaluationRestController {
    IEvaluationService evaluationService;

    @PostMapping("/addEvaluation/{demandId}/{rating}")
    public Evaluation addEvaluation(@PathVariable Long demandId,
                                    @PathVariable Long rating,
                                    @RequestParam String comment) {
        return evaluationService.saveEvaluation(demandId, rating, comment);
    }


    @GetMapping("/getEvaluations/{demandId}")
    public List<Evaluation> getEvaluations(@PathVariable Long demandId) {
        return evaluationService.getEvaluationsByDemand(demandId);
    }
}
