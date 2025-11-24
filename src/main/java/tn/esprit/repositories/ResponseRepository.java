package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Response;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response,Long> {
    List<Response> findByDemandId(Long demandId);
    List<Response> findByCommentContainingIgnoreCase(String keyword);

}
