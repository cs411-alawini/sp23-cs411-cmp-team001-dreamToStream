/*
    boundRating triggers that allow for Update action using condition (IF Statement) 
    on MovieRating and ShowRating.

    Sets bounds on if users set a value greater than 10 to cap it at 10.
    This is done before any UPDATES.
*/
CREATE TRIGGER boundRating BEFORE UPDATE ON MovieRating FOR EACH ROW BEGIN          
    IF new.value > 10 THEN           
        SET NEW.value = 10;          
    END IF;      
END;

CREATE TRIGGER boundRating BEFORE UPDATE ON ShowRating FOR EACH ROW BEGIN          
    IF new.value > 10 THEN              
        SET NEW.value = 10;          
    END IF;      
END;