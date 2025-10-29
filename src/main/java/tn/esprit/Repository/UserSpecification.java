package tn.esprit.Repository;

import org.springframework.data.jpa.domain.Specification;
import tn.esprit.Entities.User;

public class UserSpecification {

    public static Specification<User> hasUsername(String username) {
        return (root, query, cb) -> username == null ? null : cb.like(cb.lower(root.get("username")), "%" + username.toLowerCase() + "%");
    }

    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> email == null ? null : cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%");
    }

    public static Specification<User> hasPhone(Long phone) {
        return (root, query, cb) -> phone == null ? null : cb.equal(root.get("phone"), phone);
    }
}
