package tn.esprit.services;

import org.springframework.scheduling.annotation.Scheduled;
import tn.esprit.entities.Response;

import java.util.List;

public interface IResponseService {
    List<Response> getAllResponses();

    Response getResponseById(Long id);


    Response updateResponse(Long id,Response response);
    void deleteResponse(Long id) ;
    Response addResponse(Long demandId, String comment, String status);

    List<Response> searchByComment(String keyword);

    @Scheduled(cron = "0 0 * * * *") // every hour
    void deleteInappropriateResponses();

    Response getResponse(Long demandId);
    Response saveResponse(Response response, Long demandId);

    List<Response> getResponsesByDemand(Long demandId);
}
