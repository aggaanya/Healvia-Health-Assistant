package com.healthvia.backend.repository.document;



import com.healthvia.backend.entity.MedicalDocument;
import com.healthvia.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {


    // Get all documents uploaded by a user
    //handel medical report updates
    //this function :: return the list of the uploaded by the user
    List<MedicalDocument> findByUser(User user);
    long countByUserId(Long userId);
    List<MedicalDocument> findByUser_Id(Long userId);
    List<MedicalDocument> findByUserId(Long userId);
}