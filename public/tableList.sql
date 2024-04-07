-- 데이터베이스 생성
CREATE DATABASE management default CHARACTER SET UTF8; 
-- 데이터베이스 이용
use management;
-- 테이블 생성
create table product_management (
    order_id int NOT NULL AUTO_INCREMENT,
    order_code varchar(11) NOT NULL,
    order_start_date varchar(10),
    emergency_yn varchar(1),
    product_code varchar(15),
    product_quantity int,
    order_end_date varchar(10),
    etc1 varchar(255),
    color varchar(10),
    product_team varchar(10),
    ordersheet_publish_yn varchar(1), 
    ordersheet_collect_yn varchar(1),
    report_yn varchar(1),
    special_note varchar(255),
    etc2 varchar(255),
    product_complete_yn varchar(1),
    shipment_complete_yn varchar(1),
    special_note_yn varchar(1), 
    PRIMARY KEY(order_code,order_id)
);
-- 임시 데이터 INSERT
INSERT INTO product_management (order_code, order_start_date, emergency_yn, product_code, product_quantity, order_end_date, etc1)
VALUES ('240323-01', '2024-03-23', '1', 'V1234', 3, '2024-04-01', 'test1');

INSERT INTO product_management (order_code, order_start_date, emergency_yn, product_code, product_quantity, order_end_date, etc1)
VALUES ('240323-02', '2024-03-23', '0', 'V1234', 5, '2024-04-01', 'test2');

INSERT INTO product_management (order_code, order_start_date, emergency_yn, product_code, product_quantity, order_end_date, etc1)
VALUES ('240423-01', '2024-03-23', '1', 'V1234', 3, '2024-05-01', 'test3');

-- 데이터 조회 SELECT
select * from product_management;
-- 데이터 삭제 DELECT
delete from product_management where order_code = '20240323-01';
-- 데이터 갱신 UPDATE
update product_management set emergency_yn = 1 where order_code = '20240323-02';
-- 데이터 조회 SELECT
select * from product_management where emergency_yn = 1;

for (! ! ! )
하나의 행당 요청(DB) 줄 것
GRID .. 다담아서 요청할

for (! ! !)
DB 호출
GRID -> for 하나의 행당 DB 호출

DB 입장에서 하나의 행당 처리됨...///

-- product_code 
create table product_code (
    id int NOT NULL AUTO_INCREMENT,
    product_code varchar(15) NOT NULL,
    product_name varchar(255),
    company varchar(255),
    PRIMARY KEY(id,product_code)
);