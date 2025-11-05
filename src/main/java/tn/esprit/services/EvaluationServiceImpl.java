package tn.esprit.services;

import lombok.AllArgsConstructor;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;
import tn.esprit.entities.Demand;
import tn.esprit.entities.Evaluation;
import tn.esprit.entities.User;
import tn.esprit.repositories.DemandRepository;
import tn.esprit.repositories.EvaluationRepository;
import tn.esprit.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static java.awt.SystemColor.text;

@Service
@AllArgsConstructor
public class EvaluationServiceImpl implements IEvaluationService {
    EvaluationRepository evaluationRepository;
    DemandRepository demandRepository;
    UserRepository userRepository;

        public Evaluation saveEvaluation(Long demandId,Long rating,String comment) {
                Demand demand = demandRepository.findById(demandId)
                        .orElseThrow(() -> new RuntimeException("Demand not found"));



                Evaluation evaluation = new Evaluation();
                evaluation.setComment(comment);
            evaluation.setRating(rating);
                evaluation.setDate(LocalDateTime.now());
            evaluation.setDemand(demand);


                return evaluationRepository.save(evaluation);
        }


    public List<Evaluation> getEvaluationsByDemand(Long demandId) {
        return evaluationRepository.findByDemandId(demandId);
    }
}
