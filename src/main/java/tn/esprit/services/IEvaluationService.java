package tn.esprit.services;

import tn.esprit.entities.Evaluation;

import java.util.List;

public interface IEvaluationService {


    Evaluation saveEvaluation(Long demandId,Long rating,String comment);

    List<Evaluation> getEvaluationsByDemand(Long demandId);
}
