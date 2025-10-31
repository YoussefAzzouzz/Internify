package com.example.gestiondocuments.Specifications;

import com.example.gestiondocuments.Entities.Contract;
import com.example.gestiondocuments.Entities.ContractStatus;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class ContractSpecifications {

    // Filter by ID
    public static Specification<Contract> hasId(Long id) {
        return (root, query, cb) ->
                id == null ? null : cb.equal(root.get("id"), id); // If ID is null, no filtering, otherwise filter by ID
    }

    // Filter by Status
    public static Specification<Contract> hasStatus(ContractStatus status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status); // If status is null, no filtering, otherwise filter by status
    }
}

