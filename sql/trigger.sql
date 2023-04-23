CREATE TRIGGER boundRating BEFORE UPDATE ON MovieRating FOR EACH ROW BEGIN          
    IF new.value > 10 THEN              
        SET NEW.value = 10;          
    END IF;      
END;