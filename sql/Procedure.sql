DELIMITER //

CREATE PROCEDURE `get_recommendations_for_users`(IN `user_id_1` INT, IN `user_id_2 INT)
BEGIN
    	DROP TEMPORARY TABLE IF EXISTS liked_movies;
	CREATE TEMPORARY TABLE liked_movies SELECT name FROM MovieRating WHERE ID=user_id_1 or ID=user_id_2 and value > 7;

	DROP TEMPORARY TABLE IF EXISTS liked_genres;
	CREATE TEMPORARY TABLE liked_genres(
		genre VARCHAR(255),
		counts INT
	);

	DECLARE done INT DEFAULT FALSE;
    	DECLARE cur_genres VARCHAR(255);
	DECLARE count INT;
	DECLARE cur_name VARCHAR(255);

    	DECLARE movie_cursor CURSOR FOR SELECT genre FROM liked_movies;
    	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
	OPEN movie_cursor;
    	movie_loop: LOOP
        	FETCH movie_cursor INTO cur_name;
        	IF done THEN
            		LEAVE movie_loop;
        	END IF;

		SELECT genre into cur_genres FROM Movies WHERE name=cur_name LIMIT 1;

		DROP TEMPORARY TABLE IF EXISTS split_genres;
		CREATE TEMPORARY TABLE split_genres SELECT value as genre from STRING_SPLIT(REPLACE(cur_genres, ' ', ''), ',');
		DECLARE genre_cursor CURSOR FOR SELECT genre FROM split_genre;
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
		OPEN genre_cursor;
		
		DECLARE done_one INT DEFAULT FALSE;

		genre_loop: LOOP
			FETCH genre_cursor INTO cur_genres;
			IF done_one THEN
				LEAVE genre_loop;
			END IF;
		
			SELECT COUNT(*) INTO @count FROM liked_genres WHERE genre LIKE CONCAT("%",cur_genres,"%");
			IF @count = 0 THEN
				INSERT INTO liked_genres(genre, counts) VALUES(cur_genres, 1);
			ELSE
				UPDATE liked_genres SET id= id+1 WHERE genre=cur_genres
			END IF;
		END LOOP;
		CLOSE genre_cursor;

   	END LOOP;
    	CLOSE movie_cursor;

	DECLARE first_genre VARCHAR(255);
	DECLARE second_genre VARCHAR(255);

	SELECT genre INTO @first_genre FROM liked_genres LIMIT 1;
	SELECT genre INTO @second_genre FROM liked_genres LIMIT 1, 1;

	DROP TEMPORARY TABLE IF EXISTS recommendations;
	CREATE TEMPORARY TABLE recommendations SELECT * FROM Movies WHERE genre LIKE CONCAT("%",first_genre,"%",second_genre,"%");
	INSERT INTO recommendations (name, length, genre, rating, releaseYear, location, platform) 
	SELECT name, length, genre, rating, releaseYear, location, platform FROM Movies WHERE genre LIKE CONCAT("%",second_genre,"%",first_genre,"%");
	
	SELECT * FROM recommendations;
		
END //
DELIMITER ;

//current
DELIMITER //
CREATE PROCEDURE get_recommendations_for_users(IN user_id_1 INT, IN user_id_2 INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_genres VARCHAR(255);
	DECLARE count INT;
	DECLARE cur_name VARCHAR(255);

    DROP TEMPORARY TABLE IF EXISTS liked_movies;
	CREATE TEMPORARY TABLE liked_movies (name VARCHAR(255));
    INSERT INTO liked_movies (SELECT name FROM MovieRating WHERE ID=user_id_1 or ID=user_id_2 and value > 7);
	DROP TEMPORARY TABLE IF EXISTS liked_genres;
	CREATE TEMPORARY TABLE liked_genres(genre VARCHAR(255), counts INT);
	
    DECLARE movie_cursor CURSOR FOR SELECT name FROM liked_movies;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	OPEN movie_cursor;
    	movie_loop: LOOP
        	FETCH movie_cursor INTO cur_name;
        	IF done THEN LEAVE movie_loop;
        	END IF;
		SET @cur_genres := (SELECT genre into  FROM Movies WHERE name=cur_name LIMIT 1);
        DROP TEMPORARY TABLE IF EXISTS split_genres;
		SET @cur_genres := SELECT value as genre from STRING_SPLIT(REPLACE(cur_genres, ' ', ''), ',') LIMIT 1;

		SELECT COUNT(*) INTO @count FROM liked_genres WHERE genre LIKE cur_genres;
		IF @count = 0 THEN INSERT INTO liked_genres(genre, counts) VALUES(cur_genres, 1);
		ELSE UPDATE liked_genres SET id= id+1 WHERE genre=cur_genres END IF;
   	END LOOP;
    CLOSE movie_cursor;
	DECLARE first_genre VARCHAR(255);
	DECLARE second_genre VARCHAR(255);
	SELECT genre INTO @first_genre FROM liked_genres LIMIT 1;
	SELECT genre INTO @second_genre FROM liked_genres LIMIT 1, 1;
	DROP TEMPORARY TABLE IF EXISTS recommendations;
	CREATE TEMPORARY TABLE recommendations SELECT * FROM Movies WHERE genre LIKE CONCAT("%",first_genre,"%",second_genre,"%");
	INSERT INTO recommendations (name, length, genre, rating, releaseYear, location, platform) SELECT name, length, genre, rating, releaseYear, location, platform FROM Movies WHERE genre LIKE CONCAT("%",second_genre,"%",first_genre,"%");
	SELECT * FROM recommendations;
END //
DELIMITER ;
