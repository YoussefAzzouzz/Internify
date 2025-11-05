package tn.esprit.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.ResponseRequest;
import tn.esprit.services.IResponseService;
import tn.esprit.entities.Response;

import java.util.List;

@Tag(name="Responses Management")
@RestController
@AllArgsConstructor
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:4200")
public class ResponseRestController {
    IResponseService responseService;

    @GetMapping("/getAllResponses")
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping("/getResponseById/{id}")
    public Response getResponseById(@PathVariable Long id) {
        return responseService.getResponseById(id);
    }

    @PutMapping("/updateResponse/{id}")
    public Response updateResponse(@PathVariable Long id,@RequestBody Response response) {
        return responseService.updateResponse(id,response);
    }



    @DeleteMapping("/deleteResponse/{id}")
    public void deleteResponse(@PathVariable Long id) {
        responseService.deleteResponse(id);
    }


    @GetMapping("/getResponses/{demandId}")
    public List<Response> getResponses(@PathVariable Long demandId) {
        return responseService.getResponsesByDemand(demandId);
    }

    @PostMapping("/addResponse/{demandId}")
    public Response addResponse(
            @PathVariable Long demandId,
            @RequestBody ResponseRequest request) {
        return responseService.addResponse(demandId, request.getComment(), request.getStatus());
    }

    @GetMapping("/getResponse/{demandId}")
    public Response getResponse(@PathVariable Long demandId) {
        return responseService.getResponse(demandId);
    }

    @GetMapping("/search")
    public List<Response> searchResponsesByComment(@RequestParam String comment) {
        return  responseService.searchByComment(comment);

    }



}
