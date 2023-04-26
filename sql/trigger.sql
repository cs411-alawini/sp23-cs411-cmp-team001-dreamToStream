/*
    boundMovieRating and boundShowRating
    Triggers that allow for Update action using condition (IF Statement) 
    on MovieRating and ShowRating.

    Sets bounds on:
        - if users set a value greater than 10 to set it to 10
        - if users set a value less than 1 to set it to 1
    This is done before any UPDATES.
*/

CREATE TRIGGER boundMovieRating BEFORE UPDATE ON MovieRating FOR EACH ROW 
BEGIN          
    IF NEW.value > 10 THEN           
        SET NEW.value = 10;          
    ELSEIF NEW.value < 1 THEN           
        SET NEW.value = 1;          
    END IF;      
END;


CREATE TRIGGER boundShowRating BEFORE UPDATE ON ShowRating FOR EACH ROW BEGIN          
    IF NEW.value > 10 THEN           
        SET NEW.value = 10;          
    ELSEIF NEW.value < 1 THEN           
        SET NEW.value = 1;          
    END IF;         
END;
