package com.example.gestiondocuments.Services;

import com.example.gestiondocuments.Entities.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

public interface IContractService {

    Contract createContract(Contract contract, MultipartFile file) throws IOException;
    Contract createContractWithFile(Contract contract, MultipartFile file) throws IOException;
    Contract updateContract(Long id, Contract contractDetails, String base64File);
    void deleteContract(Long id);
    List<Contract> getAllContracts();
    Contract getContractById(Long id);
    List<Contract> getContractsByJobSeekerId(Long jobSeekerId);

    List<Offer> getAllOffers();
    /*List<Demand> getAllDemands();*/
    List<JobSeeker> getAllJobSeekers();
    List<Contract> getContractsByEntreprise(Long entrepriseId);
    void sendEmailNotification(String recipientEmail, String contractId);
    Map<String, Long> getContractsByStatus();
    byte[] applyWatermarkAndConvertToBase64(MultipartFile file, String watermarkText) throws IOException;
    List<Contract> getFilteredContracts(Long id, ContractStatus status);
}
