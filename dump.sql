--
-- PostgreSQL database dump
-- A01005796
-- Tony Minseok Kim
-- Set V
-- COMP 4537

-- Dumped from database version 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 13.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: options; Type: TABLE; Schema: public; Owner: tonyminseokkim
--

CREATE TABLE public.options (
    option_id integer NOT NULL,
    question_id integer NOT NULL,
    question_answer character varying NOT NULL,
    is_correct boolean NOT NULL
);


ALTER TABLE public.options OWNER TO tonyminseokkim;

--
-- Name: options_option_id_seq; Type: SEQUENCE; Schema: public; Owner: tonyminseokkim
--

CREATE SEQUENCE public.options_option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.options_option_id_seq OWNER TO tonyminseokkim;

--
-- Name: options_option_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tonyminseokkim
--

ALTER SEQUENCE public.options_option_id_seq OWNED BY public.options.option_id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: tonyminseokkim
--

CREATE TABLE public.questions (
    question_id integer NOT NULL,
    question_text character varying NOT NULL
);


ALTER TABLE public.questions OWNER TO tonyminseokkim;

--
-- Name: questions_question_id_seq; Type: SEQUENCE; Schema: public; Owner: tonyminseokkim
--

CREATE SEQUENCE public.questions_question_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_question_id_seq OWNER TO tonyminseokkim;

--
-- Name: questions_question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tonyminseokkim
--

ALTER SEQUENCE public.questions_question_id_seq OWNED BY public.questions.question_id;


--
-- Name: options option_id; Type: DEFAULT; Schema: public; Owner: tonyminseokkim
--

ALTER TABLE ONLY public.options ALTER COLUMN option_id SET DEFAULT nextval('public.options_option_id_seq'::regclass);


--
-- Name: questions question_id; Type: DEFAULT; Schema: public; Owner: tonyminseokkim
--

ALTER TABLE ONLY public.questions ALTER COLUMN question_id SET DEFAULT nextval('public.questions_question_id_seq'::regclass);


--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: tonyminseokkim
--

COPY public.options (option_id, question_id, question_answer, is_correct) FROM stdin;
21	23	1	t
22	23	2	f
23	23	3	f
24	24	true	t
25	24	false	f
28	25	1	t
29	25	11	f
30	25	12	f
31	26	232	f
32	26	32	f
33	26	32	t
34	26	3	f
35	27	1	f
36	27	3	t
5	12	hello edit test	f
6	12	world one is correct	t
7	12	new option test	f
8	12	new option asdasd	f
9	13	option 1 edit	f
10	13	option 2 edit	f
11	13	option 3	t
37	28	tonyminseokkim	t
38	28	is	f
39	28	korean	f
40	28	yo	f
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: tonyminseokkim
--

COPY public.questions (question_id, question) FROM stdin;
12	hello world from the other side edit number 4\ntest one two three test
13	testing from test test
28	tony is korean
23	question number 2
24	created from website?
25	what is the output of this?\nconsole.log(2)
26	This is a test question where the 
27	Will this break?
\.


--
-- Name: options_option_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tonyminseokkim
--

SELECT pg_catalog.setval('public.options_option_id_seq', 40, true);


--
-- Name: questions_question_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tonyminseokkim
--

SELECT pg_catalog.setval('public.questions_question_id_seq', 28, true);


--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: tonyminseokkim
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (option_id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: tonyminseokkim
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);


--
-- Name: options options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tonyminseokkim
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id);


--
-- PostgreSQL database dump complete
--
