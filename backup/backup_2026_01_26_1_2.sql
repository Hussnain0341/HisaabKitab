--
-- PostgreSQL database dump
--

\restrict 35MmoHhgM1me93Fuw6HhVjWN3ulACZDptpFWeWe7SNAuEs79XSju1ZKil4b9ZAQ

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

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

ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.supplier_payments DROP CONSTRAINT IF EXISTS supplier_payments_supplier_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sub_categories DROP CONSTRAINT IF EXISTS sub_categories_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_updated_by_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_finalized_by_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchases DROP CONSTRAINT IF EXISTS purchases_supplier_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchases DROP CONSTRAINT IF EXISTS purchases_product_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_items DROP CONSTRAINT IF EXISTS purchase_items_purchase_id_fkey;
ALTER TABLE IF EXISTS ONLY public.purchase_items DROP CONSTRAINT IF EXISTS purchase_items_item_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_supplier_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_sub_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.customer_payments DROP CONSTRAINT IF EXISTS customer_payments_customer_id_fkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
DROP TRIGGER IF EXISTS trigger_update_supplier_balance_purchases ON public.purchases;
DROP TRIGGER IF EXISTS trigger_update_supplier_balance_payments ON public.supplier_payments;
DROP TRIGGER IF EXISTS trigger_update_license_info_updated_at ON public.license_info;
DROP TRIGGER IF EXISTS trigger_update_customer_balance_sales ON public.sales;
DROP TRIGGER IF EXISTS trigger_update_customer_balance_payments ON public.customer_payments;
DROP INDEX IF EXISTS public.idx_users_username;
DROP INDEX IF EXISTS public.idx_users_role;
DROP INDEX IF EXISTS public.idx_users_active;
DROP INDEX IF EXISTS public.idx_supplier_payments_supplier;
DROP INDEX IF EXISTS public.idx_supplier_payments_date;
DROP INDEX IF EXISTS public.idx_sub_categories_status;
DROP INDEX IF EXISTS public.idx_sub_categories_category;
DROP INDEX IF EXISTS public.idx_sessions_user_id;
DROP INDEX IF EXISTS public.idx_sessions_expires;
DROP INDEX IF EXISTS public.idx_sales_payment_type;
DROP INDEX IF EXISTS public.idx_sales_invoice_number;
DROP INDEX IF EXISTS public.idx_sales_date;
DROP INDEX IF EXISTS public.idx_sales_customer;
DROP INDEX IF EXISTS public.idx_sale_items_sale_id;
DROP INDEX IF EXISTS public.idx_sale_items_product;
DROP INDEX IF EXISTS public.idx_purchases_supplier;
DROP INDEX IF EXISTS public.idx_purchases_product;
DROP INDEX IF EXISTS public.idx_purchase_items_purchase;
DROP INDEX IF EXISTS public.idx_purchase_items_item;
DROP INDEX IF EXISTS public.idx_products_supplier;
DROP INDEX IF EXISTS public.idx_products_sub_category;
DROP INDEX IF EXISTS public.idx_products_status;
DROP INDEX IF EXISTS public.idx_products_sku;
DROP INDEX IF EXISTS public.idx_products_frequently_sold;
DROP INDEX IF EXISTS public.idx_products_display_order;
DROP INDEX IF EXISTS public.idx_products_category_subcategory;
DROP INDEX IF EXISTS public.idx_products_category;
DROP INDEX IF EXISTS public.idx_products_barcode;
DROP INDEX IF EXISTS public.idx_notifications_user_id;
DROP INDEX IF EXISTS public.idx_notifications_read;
DROP INDEX IF EXISTS public.idx_notifications_created_at;
DROP INDEX IF EXISTS public.idx_license_logs_license_key;
DROP INDEX IF EXISTS public.idx_license_logs_created_at;
DROP INDEX IF EXISTS public.idx_license_info_status;
DROP INDEX IF EXISTS public.idx_license_info_pending_status;
DROP INDEX IF EXISTS public.idx_license_info_license_key;
DROP INDEX IF EXISTS public.idx_license_info_last_verified;
DROP INDEX IF EXISTS public.idx_license_info_device_id;
DROP INDEX IF EXISTS public.idx_license_info_device_active;
DROP INDEX IF EXISTS public.idx_license_info_active;
DROP INDEX IF EXISTS public.idx_expenses_date;
DROP INDEX IF EXISTS public.idx_expenses_category;
DROP INDEX IF EXISTS public.idx_customers_type;
DROP INDEX IF EXISTS public.idx_customers_status;
DROP INDEX IF EXISTS public.idx_customers_phone;
DROP INDEX IF EXISTS public.idx_customer_payments_date;
DROP INDEX IF EXISTS public.idx_customer_payments_customer;
DROP INDEX IF EXISTS public.idx_categories_status;
DROP INDEX IF EXISTS public.idx_audit_user_id;
DROP INDEX IF EXISTS public.idx_audit_timestamp;
DROP INDEX IF EXISTS public.idx_audit_table;
DROP INDEX IF EXISTS public.idx_audit_action;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_sessions DROP CONSTRAINT IF EXISTS user_sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.supplier_payments DROP CONSTRAINT IF EXISTS supplier_payments_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_categories DROP CONSTRAINT IF EXISTS sub_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.sub_categories DROP CONSTRAINT IF EXISTS sub_categories_category_id_sub_category_name_key;
ALTER TABLE IF EXISTS ONLY public.settings DROP CONSTRAINT IF EXISTS settings_pkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_pkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_pkey;
ALTER TABLE IF EXISTS ONLY public.purchases DROP CONSTRAINT IF EXISTS purchases_pkey;
ALTER TABLE IF EXISTS ONLY public.purchase_items DROP CONSTRAINT IF EXISTS purchase_items_pkey;
ALTER TABLE IF EXISTS ONLY public.products DROP CONSTRAINT IF EXISTS products_pkey;
ALTER TABLE IF EXISTS ONLY public.notifications DROP CONSTRAINT IF EXISTS notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.license_logs DROP CONSTRAINT IF EXISTS license_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.license_info DROP CONSTRAINT IF EXISTS license_info_pkey;
ALTER TABLE IF EXISTS ONLY public.license_info DROP CONSTRAINT IF EXISTS license_info_license_key_device_id_key;
ALTER TABLE IF EXISTS ONLY public.license_info DROP CONSTRAINT IF EXISTS license_info_license_id_key;
ALTER TABLE IF EXISTS ONLY public.encryption_keys DROP CONSTRAINT IF EXISTS encryption_keys_pkey;
ALTER TABLE IF EXISTS ONLY public.encryption_keys DROP CONSTRAINT IF EXISTS encryption_keys_key_name_key;
ALTER TABLE IF EXISTS ONLY public.daily_expenses DROP CONSTRAINT IF EXISTS daily_expenses_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customer_payments DROP CONSTRAINT IF EXISTS customer_payments_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_category_name_key;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN supplier_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.supplier_payments ALTER COLUMN payment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sub_categories ALTER COLUMN sub_category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sales ALTER COLUMN sale_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sale_items ALTER COLUMN sale_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.purchases ALTER COLUMN purchase_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.purchase_items ALTER COLUMN purchase_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.products ALTER COLUMN product_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notifications ALTER COLUMN notification_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.license_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.license_info ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.encryption_keys ALTER COLUMN key_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.daily_expenses ALTER COLUMN expense_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customers ALTER COLUMN customer_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customer_payments ALTER COLUMN payment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.audit_logs ALTER COLUMN log_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_user_id_seq;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_sessions;
DROP SEQUENCE IF EXISTS public.suppliers_supplier_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.supplier_payments_payment_id_seq;
DROP TABLE IF EXISTS public.supplier_payments;
DROP SEQUENCE IF EXISTS public.sub_categories_sub_category_id_seq;
DROP TABLE IF EXISTS public.sub_categories;
DROP SEQUENCE IF EXISTS public.settings_id_seq;
DROP TABLE IF EXISTS public.settings;
DROP SEQUENCE IF EXISTS public.sales_sale_id_seq;
DROP TABLE IF EXISTS public.sales;
DROP SEQUENCE IF EXISTS public.sale_items_sale_item_id_seq;
DROP TABLE IF EXISTS public.sale_items;
DROP SEQUENCE IF EXISTS public.purchases_purchase_id_seq;
DROP TABLE IF EXISTS public.purchases;
DROP SEQUENCE IF EXISTS public.purchase_items_purchase_item_id_seq;
DROP TABLE IF EXISTS public.purchase_items;
DROP SEQUENCE IF EXISTS public.products_product_id_seq;
DROP TABLE IF EXISTS public.products;
DROP SEQUENCE IF EXISTS public.notifications_notification_id_seq;
DROP TABLE IF EXISTS public.notifications;
DROP SEQUENCE IF EXISTS public.license_logs_id_seq;
DROP TABLE IF EXISTS public.license_logs;
DROP SEQUENCE IF EXISTS public.license_info_id_seq;
DROP TABLE IF EXISTS public.license_info;
DROP SEQUENCE IF EXISTS public.encryption_keys_key_id_seq;
DROP TABLE IF EXISTS public.encryption_keys;
DROP SEQUENCE IF EXISTS public.daily_expenses_expense_id_seq;
DROP TABLE IF EXISTS public.daily_expenses;
DROP SEQUENCE IF EXISTS public.customers_customer_id_seq;
DROP TABLE IF EXISTS public.customers;
DROP SEQUENCE IF EXISTS public.customer_payments_payment_id_seq;
DROP TABLE IF EXISTS public.customer_payments;
DROP SEQUENCE IF EXISTS public.categories_category_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.audit_logs_log_id_seq;
DROP TABLE IF EXISTS public.audit_logs;
DROP FUNCTION IF EXISTS public.update_supplier_balance();
DROP FUNCTION IF EXISTS public.update_license_info_updated_at();
DROP FUNCTION IF EXISTS public.update_customer_balance();
DROP FUNCTION IF EXISTS public.log_audit_change();
DROP FUNCTION IF EXISTS public.is_last_administrator(check_user_id integer);
DROP FUNCTION IF EXISTS public.create_notification(p_user_id integer, p_title character varying, p_message text, p_type character varying, p_link character varying, p_metadata jsonb);
DROP FUNCTION IF EXISTS public.cleanup_expired_sessions();
--
-- Name: cleanup_expired_sessions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.cleanup_expired_sessions() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$;


--
-- Name: create_notification(integer, character varying, text, character varying, character varying, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_notification(p_user_id integer, p_title character varying, p_message text, p_type character varying DEFAULT 'info'::character varying, p_link character varying DEFAULT NULL::character varying, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_notification_id INTEGER;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, link, metadata)
    VALUES (p_user_id, p_title, p_message, p_type, p_link, p_metadata)
    RETURNING notification_id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$;


--
-- Name: is_last_administrator(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_last_administrator(check_user_id integer) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    admin_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO admin_count
    FROM users
    WHERE role = 'administrator' 
    AND is_active = true
    AND user_id != check_user_id;
    
    RETURN admin_count = 0;
END;
$$;


--
-- Name: log_audit_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_audit_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    current_user_id INTEGER;
BEGIN
    -- Get current user ID from session (if available)
    -- This will be set by the application layer
    current_user_id := current_setting('app.current_user_id', true)::INTEGER;
    
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'delete', TG_TABLE_NAME, OLD.id, 
            row_to_json(OLD)::jsonb, NULL
        );
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'update', TG_TABLE_NAME, NEW.id,
            row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values
        ) VALUES (
            current_user_id, 'create', TG_TABLE_NAME, NEW.id,
            NULL, row_to_json(NEW)::jsonb
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: update_customer_balance(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_customer_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE customers
    SET current_balance = opening_balance + 
        COALESCE((SELECT SUM(total_amount - paid_amount) FROM sales WHERE customer_id = customers.customer_id AND payment_type IN ('credit', 'split')), 0) -
        COALESCE((SELECT SUM(amount) FROM customer_payments WHERE customer_id = customers.customer_id), 0)
    WHERE customer_id = COALESCE(NEW.customer_id, OLD.customer_id);
    RETURN NEW;
END;
$$;


--
-- Name: update_license_info_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_license_info_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


--
-- Name: update_supplier_balance(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_supplier_balance() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE suppliers
    SET balance = opening_balance + 
        COALESCE((SELECT SUM(total_amount) FROM purchases WHERE supplier_id = suppliers.supplier_id AND payment_type = 'credit'), 0) -
        COALESCE((SELECT SUM(amount) FROM supplier_payments WHERE supplier_id = suppliers.supplier_id), 0)
    WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id);
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    log_id integer NOT NULL,
    user_id integer,
    action character varying(50) NOT NULL,
    table_name character varying(100),
    record_id integer,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    user_agent text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notes text
);


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_log_id_seq OWNED BY public.audit_logs.log_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT categories_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: TABLE categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.categories IS 'Product categories';


--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: customer_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_payments (
    payment_id integer NOT NULL,
    customer_id integer NOT NULL,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount numeric(12,2) NOT NULL,
    payment_method character varying(20) DEFAULT 'cash'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customer_payments_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT customer_payments_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'bank_transfer'::character varying, 'other'::character varying])::text[])))
);


--
-- Name: TABLE customer_payments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.customer_payments IS 'Customer loan/payment transactions';


--
-- Name: customer_payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_payments_payment_id_seq OWNED BY public.customer_payments.payment_id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(20),
    address text,
    opening_balance numeric(12,2) DEFAULT 0,
    current_balance numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'active'::character varying,
    customer_type character varying(20) DEFAULT 'walk-in'::character varying,
    credit_limit numeric(10,2) DEFAULT NULL::numeric,
    CONSTRAINT customers_customer_type_check CHECK (((customer_type)::text = ANY ((ARRAY['walk-in'::character varying, 'retail'::character varying, 'wholesale'::character varying, 'special'::character varying])::text[]))),
    CONSTRAINT customers_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: TABLE customers; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.customers IS 'Customer master data with opening and current balance';


--
-- Name: COLUMN customers.customer_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.customers.customer_type IS 'Customer type: walk-in, retail, wholesale, special';


--
-- Name: COLUMN customers.credit_limit; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.customers.credit_limit IS 'Maximum credit limit for credit customers (optional)';


--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: daily_expenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_expenses (
    expense_id integer NOT NULL,
    expense_category character varying(100) NOT NULL,
    amount numeric(12,2) NOT NULL,
    expense_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_method character varying(20) DEFAULT 'cash'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT daily_expenses_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT daily_expenses_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'bank_transfer'::character varying, 'other'::character varying])::text[])))
);


--
-- Name: TABLE daily_expenses; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.daily_expenses IS 'Daily expense tracking';


--
-- Name: daily_expenses_expense_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.daily_expenses_expense_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: daily_expenses_expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.daily_expenses_expense_id_seq OWNED BY public.daily_expenses.expense_id;


--
-- Name: encryption_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.encryption_keys (
    key_id integer NOT NULL,
    key_name character varying(100) NOT NULL,
    encrypted_key text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: encryption_keys_key_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.encryption_keys_key_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: encryption_keys_key_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.encryption_keys_key_id_seq OWNED BY public.encryption_keys.key_id;


--
-- Name: license_info; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.license_info (
    id integer NOT NULL,
    license_id character varying(255),
    tenant_id character varying(255),
    license_key character varying(255) NOT NULL,
    device_id character varying(255) NOT NULL,
    device_fingerprint text NOT NULL,
    expires_at timestamp without time zone,
    last_validated_at timestamp without time zone,
    validation_count integer DEFAULT 0,
    is_active boolean DEFAULT false,
    features jsonb DEFAULT '{}'::jsonb,
    max_users integer DEFAULT 1,
    max_devices integer DEFAULT 1,
    app_version character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_verified_at timestamp without time zone,
    pending_status character varying(50),
    pending_status_count integer DEFAULT 0,
    activated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_known_valid_date timestamp without time zone,
    tenant_name character varying(255),
    status character varying(50)
);


--
-- Name: TABLE license_info; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.license_info IS 'Encrypted license information for activation and validation';


--
-- Name: license_info_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.license_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: license_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.license_info_id_seq OWNED BY public.license_info.id;


--
-- Name: license_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.license_logs (
    id integer NOT NULL,
    license_key character varying(255),
    device_id character varying(255),
    action character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    message text,
    error_details text,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: TABLE license_logs; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.license_logs IS 'License action logs for debugging and support';


--
-- Name: license_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.license_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: license_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.license_logs_id_seq OWNED BY public.license_logs.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
    read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    link character varying(500),
    metadata jsonb,
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['info'::character varying, 'success'::character varying, 'warning'::character varying, 'error'::character varying])::text[])))
);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    sku character varying(100),
    category character varying(100),
    purchase_price numeric(10,2) DEFAULT 0 NOT NULL,
    selling_price numeric(10,2) DEFAULT 0 NOT NULL,
    quantity_in_stock integer DEFAULT 0 NOT NULL,
    supplier_id integer,
    barcode character varying(100),
    tax_percentage numeric(5,2) DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    category_id integer,
    sub_category_id integer,
    item_name_english character varying(255) NOT NULL,
    item_name_urdu character varying(255),
    retail_price numeric(10,2) NOT NULL,
    wholesale_price numeric(10,2),
    special_price numeric(10,2),
    unit_type character varying(50) DEFAULT 'piece'::character varying,
    is_frequently_sold boolean DEFAULT false,
    display_order integer DEFAULT 0,
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[]))),
    CONSTRAINT products_unit_type_check CHECK (((unit_type)::text = ANY ((ARRAY['piece'::character varying, 'packet'::character varying, 'meter'::character varying, 'box'::character varying, 'kg'::character varying, 'roll'::character varying])::text[])))
);


--
-- Name: COLUMN products.item_name_english; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.item_name_english IS 'Item name in English';


--
-- Name: COLUMN products.item_name_urdu; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.item_name_urdu IS 'Item name in Urdu';


--
-- Name: COLUMN products.retail_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.retail_price IS 'Price for retail customers';


--
-- Name: COLUMN products.wholesale_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.wholesale_price IS 'Price for wholesale customers';


--
-- Name: COLUMN products.special_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.special_price IS 'Special price override for special customers';


--
-- Name: COLUMN products.unit_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.unit_type IS 'Unit of measurement: piece, packet, meter, box, etc.';


--
-- Name: COLUMN products.is_frequently_sold; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.is_frequently_sold IS 'Flag for frequently sold items (appears first in POS)';


--
-- Name: COLUMN products.display_order; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.display_order IS 'Custom display order for items';


--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: purchase_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchase_items (
    purchase_item_id integer NOT NULL,
    purchase_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    cost_price numeric(10,2) NOT NULL,
    subtotal numeric(12,2) NOT NULL,
    CONSTRAINT purchase_items_quantity_check CHECK ((quantity > 0))
);


--
-- Name: TABLE purchase_items; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.purchase_items IS 'Line items for each purchase order';


--
-- Name: purchase_items_purchase_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.purchase_items_purchase_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchase_items_purchase_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.purchase_items_purchase_item_id_seq OWNED BY public.purchase_items.purchase_item_id;


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchases (
    purchase_id integer NOT NULL,
    product_id integer,
    supplier_id integer NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    quantity integer DEFAULT 1,
    purchase_price numeric(10,2),
    total_amount numeric(12,2) DEFAULT 0,
    payment_type character varying(20) DEFAULT 'cash'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT purchases_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['cash'::character varying, 'credit'::character varying])::text[])))
);


--
-- Name: COLUMN purchases.product_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.purchases.product_id IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';


--
-- Name: COLUMN purchases.quantity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.purchases.quantity IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';


--
-- Name: COLUMN purchases.purchase_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.purchases.purchase_price IS 'Deprecated: Use purchase_items table instead. Kept for backward compatibility.';


--
-- Name: purchases_purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.purchases_purchase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: purchases_purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.purchases_purchase_id_seq OWNED BY public.purchases.purchase_id;


--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_items (
    sale_item_id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    selling_price numeric(10,2) NOT NULL,
    purchase_price numeric(10,2) NOT NULL,
    profit numeric(10,2) NOT NULL
);


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sale_items_sale_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sale_items_sale_item_id_seq OWNED BY public.sale_items.sale_item_id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales (
    sale_id integer NOT NULL,
    invoice_number character varying(50) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    customer_name character varying(255),
    total_amount numeric(12,2) DEFAULT 0 NOT NULL,
    total_profit numeric(12,2) DEFAULT 0 NOT NULL,
    customer_id integer,
    payment_type character varying(20) DEFAULT 'cash'::character varying,
    paid_amount numeric(12,2) DEFAULT 0,
    discount numeric(12,2) DEFAULT 0,
    tax numeric(12,2) DEFAULT 0,
    subtotal numeric(12,2) DEFAULT 0,
    is_finalized boolean DEFAULT false,
    finalized_at timestamp without time zone,
    finalized_by integer,
    created_by integer,
    updated_by integer,
    CONSTRAINT sales_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'credit'::character varying, 'split'::character varying])::text[])))
);


--
-- Name: sales_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_sale_id_seq OWNED BY public.sales.sale_id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    printer_config text,
    language character varying(10) DEFAULT 'en'::character varying,
    other_app_settings jsonb,
    first_time_setup_complete boolean DEFAULT false
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: sub_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sub_categories (
    sub_category_id integer NOT NULL,
    category_id integer NOT NULL,
    sub_category_name character varying(255) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sub_categories_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: TABLE sub_categories; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sub_categories IS 'Product sub-categories linked to categories';


--
-- Name: sub_categories_sub_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sub_categories_sub_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sub_categories_sub_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sub_categories_sub_category_id_seq OWNED BY public.sub_categories.sub_category_id;


--
-- Name: supplier_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.supplier_payments (
    payment_id integer NOT NULL,
    supplier_id integer NOT NULL,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount numeric(12,2) NOT NULL,
    payment_method character varying(20) DEFAULT 'cash'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT supplier_payments_amount_check CHECK ((amount > (0)::numeric)),
    CONSTRAINT supplier_payments_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'bank_transfer'::character varying, 'cheque'::character varying, 'other'::character varying])::text[])))
);


--
-- Name: TABLE supplier_payments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.supplier_payments IS 'Supplier payment transactions';


--
-- Name: supplier_payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.supplier_payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: supplier_payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.supplier_payments_payment_id_seq OWNED BY public.supplier_payments.payment_id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    supplier_id integer NOT NULL,
    name character varying(255) NOT NULL,
    contact_number character varying(20),
    total_purchased numeric(12,2) DEFAULT 0,
    total_paid numeric(12,2) DEFAULT 0,
    balance numeric(12,2) DEFAULT 0,
    opening_balance numeric(12,2) DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT suppliers_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    session_id character varying(255) NOT NULL,
    user_id integer NOT NULL,
    device_id character varying(255),
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    expires_at timestamp without time zone NOT NULL,
    last_activity timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'cashier'::character varying NOT NULL,
    pin_hash character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    password_reset_token character varying(255),
    password_reset_expires timestamp without time zone,
    security_question text,
    security_answer_hash character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['administrator'::character varying, 'cashier'::character varying])::text[])))
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: audit_logs log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN log_id SET DEFAULT nextval('public.audit_logs_log_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: customer_payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_payments ALTER COLUMN payment_id SET DEFAULT nextval('public.customer_payments_payment_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: daily_expenses expense_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_expenses ALTER COLUMN expense_id SET DEFAULT nextval('public.daily_expenses_expense_id_seq'::regclass);


--
-- Name: encryption_keys key_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.encryption_keys ALTER COLUMN key_id SET DEFAULT nextval('public.encryption_keys_key_id_seq'::regclass);


--
-- Name: license_info id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_info ALTER COLUMN id SET DEFAULT nextval('public.license_info_id_seq'::regclass);


--
-- Name: license_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_logs ALTER COLUMN id SET DEFAULT nextval('public.license_logs_id_seq'::regclass);


--
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: purchase_items purchase_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items ALTER COLUMN purchase_item_id SET DEFAULT nextval('public.purchase_items_purchase_item_id_seq'::regclass);


--
-- Name: purchases purchase_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases ALTER COLUMN purchase_id SET DEFAULT nextval('public.purchases_purchase_id_seq'::regclass);


--
-- Name: sale_items sale_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items ALTER COLUMN sale_item_id SET DEFAULT nextval('public.sale_items_sale_item_id_seq'::regclass);


--
-- Name: sales sale_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_sale_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: sub_categories sub_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_categories ALTER COLUMN sub_category_id SET DEFAULT nextval('public.sub_categories_sub_category_id_seq'::regclass);


--
-- Name: supplier_payments payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_payments ALTER COLUMN payment_id SET DEFAULT nextval('public.supplier_payments_payment_id_seq'::regclass);


--
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (log_id, user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, "timestamp", notes) FROM stdin;
1	\N	login_failed	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 13:35:49.977983	Failed login attempt
2	1	first_time_setup	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 14:35:25.433593	First-time setup completed, administrator account created
3	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 14:35:40.755741	User logged in successfully
4	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 14:38:14.479894	User logged in successfully
5	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:15:28.718689	User logged in successfully
6	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:18:42.775461	User logged in successfully
7	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:20:30.452893	User logged in successfully
8	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:22:36.73888	User logged in successfully
9	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:25:36.269594	User logged in successfully
10	1	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:27:56.923202	User logged out
11	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:28:28.666956	User logged in successfully
12	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 18:17:11.025143	Accessed sensitive resource: users
13	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 18:17:37.272956	Accessed sensitive resource: users
14	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:28:34.201723	Accessed sensitive resource: users
15	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:28:36.77861	Accessed sensitive resource: users
16	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:29:12.991931	Accessed sensitive resource: users
17	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:29:45.309293	Accessed sensitive resource: users
18	1	view_sensitive	audit_logs	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:29:48.144714	Accessed sensitive resource: audit_logs
19	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 20:30:21.922945	Accessed sensitive resource: users
20	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:16:05.665391	Accessed sensitive resource: users
21	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:52:25.912717	Accessed sensitive resource: users
22	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:52:29.629893	Accessed sensitive resource: users
23	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:52:34.221514	Accessed sensitive resource: users
24	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:52:43.157134	Accessed sensitive resource: users
25	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:52:45.543769	Accessed sensitive resource: users
26	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:53:16.160959	Accessed sensitive resource: users
27	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:59:13.866642	Accessed sensitive resource: users
28	1	view_sensitive	audit_logs	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 00:59:16.489263	Accessed sensitive resource: audit_logs
29	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:02:21.355556	Accessed sensitive resource: users
30	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:06:31.702484	Accessed sensitive resource: users
31	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:06:57.537616	Accessed sensitive resource: users
32	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:32:05.803829	Accessed sensitive resource: users
33	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:36:54.365892	Accessed sensitive resource: users
34	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:37:34.332784	Accessed sensitive resource: users
35	1	create	users	2	\N	{"name": "Hussnain", "role": "cashier", "username": "Cashier"}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:39:37.225997	Admin admin created user: Cashier
36	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:39:37.232051	Accessed sensitive resource: users
37	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:39:58.889196	Accessed sensitive resource: users
38	1	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:40:04.693023	User logged out
39	2	password_recovery_requested	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:48:12.10517	Password recovery key generated
40	2	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 01:48:46.565212	User logged in successfully
41	2	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 02:37:05.449261	User logged out
42	2	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:09:02.069753	User logged in successfully
43	2	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:09:26.547806	User logged out
44	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:09:54.9078	User logged in successfully
45	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:10:04.229431	Accessed sensitive resource: users
46	1	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:10:49.447967	User logged out
47	2	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:24:32.524736	User logged in successfully
48	2	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:46:09.857674	User logged out
49	1	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 15:47:06.715491	User logged in successfully
50	1	view_sensitive	users	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 16:15:21.845325	Accessed sensitive resource: users
51	1	logout	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 16:15:48.729133	User logged out
52	2	login	\N	\N	\N	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 16:16:00.659229	User logged in successfully
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (category_id, category_name, status, created_at) FROM stdin;
1	ABC Category	active	2026-01-19 03:07:26.132708
272	Electrical Wires & Cables	active	2026-01-19 14:33:01.012952
273	Switches & Sockets	active	2026-01-19 14:33:01.012952
274	Lighting	active	2026-01-19 14:33:01.012952
275	Fans & Ventilation	active	2026-01-19 14:33:01.012952
276	Circuit Breakers	active	2026-01-19 14:33:01.012952
277	MCBs & Fuses	active	2026-01-19 14:33:01.012952
278	Conduit Pipes	active	2026-01-19 14:33:01.012952
279	Junction Boxes	active	2026-01-19 14:33:01.012952
280	Tools & Equipment	active	2026-01-19 14:33:01.012952
281	Safety Equipment	active	2026-01-19 14:33:01.012952
282	Batteries	active	2026-01-19 14:33:01.012952
283	Transformers	active	2026-01-19 14:33:01.012952
284	Motors	active	2026-01-19 14:33:01.012952
285	Pipes & Fittings	active	2026-01-19 14:33:01.012952
286	Valves	active	2026-01-19 14:33:01.012952
287	Pumps	active	2026-01-19 14:33:01.012952
288	Water Heaters	active	2026-01-19 14:33:01.012952
289	Sanitary Ware	active	2026-01-19 14:33:01.012952
290	Tiles	active	2026-01-19 14:33:01.012952
291	Cement & Mortar	active	2026-01-19 14:33:01.012952
292	Steel & Iron	active	2026-01-19 14:33:01.012952
293	Wood & Timber	active	2026-01-19 14:33:01.012952
294	Paint & Chemicals	active	2026-01-19 14:33:01.012952
295	Hardware Accessories	active	2026-01-19 14:33:01.012952
296	Locks & Keys	active	2026-01-19 14:33:01.012952
297	Hinges & Handles	active	2026-01-19 14:33:01.012952
298	Nails & Screws	active	2026-01-19 14:33:01.012952
299	Adhesives	active	2026-01-19 14:33:01.012952
300	Sealants	active	2026-01-19 14:33:01.012952
301	Miscellaneous	active	2026-01-19 14:33:01.012952
302	General	active	2026-01-20 16:51:13.659405
\.


--
-- Data for Name: customer_payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_payments (payment_id, customer_id, payment_date, amount, payment_method, notes, created_at) FROM stdin;
1	827	2025-08-29 12:26:05.326768	1100.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
2	835	2025-10-25 17:16:35.252194	1200.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
3	837	2025-12-18 17:30:08.04697	1300.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
4	845	2025-11-29 03:11:25.210606	1400.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
5	847	2025-11-23 16:08:00.819691	1500.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
6	855	2025-10-06 15:17:02.690997	1600.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
7	857	2025-11-09 20:33:34.739859	1700.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
8	865	2025-11-20 23:47:21.006709	1800.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
9	867	2025-12-30 03:19:47.735048	1900.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
10	875	2026-01-12 05:35:34.914484	2000.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
11	877	2025-10-11 15:45:33.458124	2100.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
12	885	2025-08-04 05:38:33.714595	2200.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
13	887	2025-08-14 06:02:43.688968	2300.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
14	895	2025-11-26 14:23:01.475112	2400.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
15	897	2025-12-20 14:26:06.571509	2500.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
16	905	2025-12-28 18:51:47.146117	2600.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
17	907	2025-09-12 02:56:10.728159	2700.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
18	915	2025-12-23 22:12:31.647583	2800.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
19	917	2025-12-13 14:38:21.283811	2900.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
20	925	2026-01-07 06:26:04.433937	3000.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
21	927	2025-10-04 17:05:02.730027	3100.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
22	829	2025-10-31 14:10:06.547434	3200.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
23	831	2025-07-28 12:57:52.025747	3300.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
24	833	2026-01-02 21:44:31.283614	3400.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
25	839	2025-07-30 01:09:00.678352	3500.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
26	841	2025-07-29 11:48:58.281759	3600.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
27	843	2025-08-26 20:34:02.605668	3700.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
28	849	2025-12-21 17:31:06.003977	3800.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
29	851	2025-10-10 06:19:40.858897	3900.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
30	853	2025-08-06 21:51:44.014884	4000.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
31	859	2025-11-25 19:59:56.058682	4100.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
32	861	2025-12-25 20:27:51.661999	4200.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
33	863	2025-09-27 16:05:00.311086	4300.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
34	869	2025-12-25 17:04:10.824167	4400.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
35	871	2025-08-29 18:02:55.040131	4500.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
36	873	2025-07-28 05:48:10.530955	4600.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
37	879	2025-10-04 21:08:06.63229	4700.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
38	881	2025-08-03 11:15:23.263009	4800.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
39	883	2025-11-24 12:32:22.519088	4900.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
40	889	2025-08-31 23:17:39.484127	5000.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
41	891	2025-08-03 13:54:27.649338	5100.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
42	893	2025-12-09 00:36:01.547055	5200.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
43	899	2025-12-17 01:53:50.935328	5300.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
44	901	2025-11-07 00:45:47.534356	5400.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
45	903	2026-01-01 01:06:50.965824	5500.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
46	909	2025-11-07 07:38:36.448178	5600.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
47	911	2026-01-09 16:57:36.144335	5700.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
48	913	2025-11-04 03:47:43.818322	5800.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
49	919	2025-12-28 08:31:04.76225	5900.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
50	921	2025-12-28 07:13:04.073997	6000.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
51	923	2025-09-21 19:32:04.190735	6100.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
52	1	2025-10-30 11:35:21.036069	6200.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
53	827	2025-10-13 15:32:18.375139	6300.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
54	835	2025-08-07 20:01:44.790917	6400.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
55	837	2025-09-16 11:38:39.960583	6500.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
56	845	2025-11-21 01:04:11.297731	6600.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
57	847	2025-09-15 08:21:46.15977	6700.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
58	855	2025-08-08 02:16:58.066892	6800.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
59	857	2025-08-31 08:19:08.702729	6900.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
60	865	2025-08-27 23:51:27.502651	7000.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
61	867	2025-08-22 12:30:18.311246	7100.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
62	875	2025-08-10 13:06:12.158775	7200.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
63	877	2025-08-16 15:59:03.128635	7300.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
64	885	2025-08-04 20:44:09.335666	7400.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
65	887	2025-12-22 20:19:49.945755	7500.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
66	895	2025-09-05 21:34:38.592837	7600.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
67	897	2025-11-17 11:11:05.43844	7700.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
68	905	2025-12-04 12:18:20.792932	7800.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
69	907	2025-07-24 17:32:25.011573	7900.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
70	915	2025-09-05 10:23:36.952925	8000.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
71	917	2025-12-21 12:21:32.468208	8100.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
72	925	2025-11-18 07:23:15.606359	8200.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
73	927	2025-08-22 10:07:58.417883	8300.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
74	829	2025-12-29 12:46:45.678061	8400.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
75	831	2025-12-06 20:05:09.796364	8500.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
76	833	2025-12-14 20:46:25.779655	8600.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
77	839	2025-11-14 08:02:39.592145	8700.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
78	841	2025-09-10 11:40:45.141533	8800.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
79	843	2025-10-17 18:44:20.270524	8900.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
80	849	2025-11-19 15:42:17.14638	9000.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
81	851	2025-10-04 15:07:02.018014	9100.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
82	853	2025-09-05 19:01:46.356704	9200.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
83	859	2025-09-06 01:02:35.018185	9300.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
84	861	2025-12-04 18:05:19.71654	9400.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
85	863	2025-09-11 18:17:30.508188	9500.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
86	869	2025-11-25 17:55:42.095447	9600.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
87	871	2025-10-08 04:30:29.753392	9700.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
88	873	2025-07-24 07:51:48.835861	9800.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
89	879	2025-10-23 05:03:10.774241	9900.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
90	881	2025-08-24 09:32:39.312461	10000.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
91	883	2025-09-10 18:10:22.934774	10100.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
92	889	2025-09-02 12:07:27.526135	10200.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
93	891	2025-11-09 12:52:07.114124	10300.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
94	893	2025-11-05 04:07:14.290231	10400.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
95	899	2025-10-28 21:36:19.228854	10500.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
96	901	2025-08-22 21:56:29.793989	10600.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
97	903	2025-11-18 04:28:44.476686	10700.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
98	909	2025-09-19 11:16:09.009246	10800.00	other	Payment against outstanding balance	2026-01-19 14:33:01.012952
99	911	2025-08-02 10:02:55.993925	10900.00	cash	Payment against outstanding balance	2026-01-19 14:33:01.012952
100	913	2025-11-15 10:40:31.291705	11000.00	bank_transfer	Payment against outstanding balance	2026-01-19 14:33:01.012952
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (customer_id, name, phone, address, opening_balance, current_balance, created_at, status, customer_type, credit_limit) FROM stdin;
930	Project Manager	+92 341 0348031	\N	0.00	0.00	2026-01-24 06:04:43.1244	active	walk-in	\N
826	Ahmed Ali	0300-1111111	Karachi	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
836	Tariq Mehmood	0310-2020202	Hyderabad	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
846	Adnan Khan	0320-3333333	Mingora	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
856	Danish Ali	0330-4040404	Nawabshah	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
866	Hassan Raza	0340-5555555	Dadu	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
876	Idris Khan	0350-6060606	Sanghar	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
886	Yusuf Khan	0360-7777777	Garhi Khairo	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
896	Sulaiman Raza	0370-8080808	Jati	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
906	Hud Raza	0380-9999999	Quetta	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
916	Yaqub Ahmed	0390-1111111	Musakhel	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
926	Yahya Ahmed	0300-1111112	Awaran	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
928	Ilyas Malik	0300-1111114	Kech	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
828	Muhammad Usman	0302-3333333	Islamabad	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
830	Bilal Ahmed	0304-5555555	Rawalpindi	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
832	Hamza Sheikh	0306-7777777	Gujranwala	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
834	Usman Ali	0308-9999999	Quetta	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
838	Nadeem Iqbal	0312-4040404	Bahawalpur	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
840	Shahid Raza	0314-6060606	Jhang	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
842	Imran Khan	0316-8080808	Rahim Yar Khan	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
844	Waseem Ali	0318-1111111	Kasur	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
848	Salman Ahmed	0322-5555555	Dera Ghazi Khan	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
850	Babar Malik	0324-7777777	Okara	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
852	Yasir Ali	0326-9999999	Kamoke	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
854	Saad Raza	0328-2020202	Kotri	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
858	Ayan Sheikh	0332-6060606	Jacobabad	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
860	Hammad Ali	0334-8080808	Khairpur	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
862	Arslan Raza	0336-1111111	Rohri	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
864	Talha Ali	0338-3333333	Kandhkot	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
868	Ibrahim Ali	0342-7777777	Thatta	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
870	Ismail Khan	0344-9999999	Tando Adam	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
872	Musa Raza	0346-2020202	Matli	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
874	Zakariya Ali	0348-4040404	Umerkot	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
878	Luqman Ali	0352-8080808	Samaro	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
880	Dawud Khan	0354-1111111	Mithi	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
882	Yaqub Ahmed	0356-3333333	Nagarparkar	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
884	Ismail Ali	0358-5555555	Daharki	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
888	Shuaib Ahmed	0362-9999999	Naushahro Feroze	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
890	Salih Khan	0364-2020202	Bhiria	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
892	Yahya Ahmed	0366-4040404	Daur	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
894	Ilyas Malik	0368-6060606	Keti Bunder	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
898	Suleman Ali	0372-1111111	Ormara	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
900	Ishaq Khan	0374-3333333	Gwadar	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
902	Ayyub Raza	0376-5555555	Panjgur	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
904	Ayoub Ali	0378-7777777	Kalat	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
908	Zakariya Ali	0382-2020202	Zhob	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
910	Idris Khan	0384-4040404	Dera Bugti	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
912	Luqman Ali	0386-6060606	Naseerabad	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
914	Dawud Khan	0388-8080808	Kohlu	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
918	Ismail Ali	0392-3333333	Ziarat	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
920	Yusuf Khan	0394-5555555	Killa Saifullah	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
922	Shuaib Ahmed	0396-7777777	Killa Abdullah	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
924	Salih Khan	0398-9999999	Nushki	0.00	0.00	2026-01-19 14:33:01.012952	active	walk-in	\N
919	Ayyub Raza	0393-4444444	Harnai	8900.00	3000.00	2026-01-19 14:33:01.012952	active	retail	\N
921	Ayoub Ali	0395-6666666	Pishin	21000.00	15000.00	2026-01-19 14:33:01.012952	active	wholesale	\N
923	Hud Raza	0397-8888888	Chagai	7600.00	1500.00	2026-01-19 14:33:01.012952	active	retail	\N
827	Hassan Khan	0301-2222222	Lahore	5000.00	-2400.00	2026-01-19 14:33:01.012952	active	retail	\N
835	Fahad Khan	0309-1010101	Peshawar	3000.00	-4600.00	2026-01-19 14:33:01.012952	active	retail	\N
837	Sajid Hussain	0311-3030303	Sargodha	12000.00	4200.00	2026-01-19 14:33:01.012952	active	wholesale	\N
845	Noman Sheikh	0319-2222222	Mardan	18000.00	10000.00	2026-01-19 14:33:01.012952	active	wholesale	\N
847	Farhan Ali	0321-4444444	Abbottabad	4000.00	-4200.00	2026-01-19 14:33:01.012952	active	retail	\N
855	Zeeshan Khan	0329-3030303	Mirpur Khas	7000.00	-1400.00	2026-01-19 14:33:01.012952	active	retail	\N
857	Haris Malik	0331-5050505	Larkana	11000.00	2400.00	2026-01-19 14:33:01.012952	active	wholesale	\N
865	Moiz Malik	0339-4444444	Kashmore	22000.00	13200.00	2026-01-19 14:33:01.012952	active	special	\N
867	Ahmad Khan	0341-6666666	Jamshoro	6500.00	-2500.00	2026-01-19 14:33:01.012952	active	retail	\N
875	Yahya Ahmed	0349-5050505	Khipro	5500.00	-3700.00	2026-01-19 14:33:01.012952	active	retail	\N
877	Ilyas Malik	0351-7070707	Kunri	19000.00	9600.00	2026-01-19 14:33:01.012952	active	wholesale	\N
885	Ayyub Raza	0359-6666666	Pano Aqil	15000.00	5400.00	2026-01-19 14:33:01.012952	active	wholesale	\N
887	Ayoub Ali	0361-8888888	Kandiaro	6200.00	-3600.00	2026-01-19 14:33:01.012952	active	retail	\N
895	Luqman Ali	0369-7070707	Shahbandar	6800.00	-3200.00	2026-01-19 14:33:01.012952	active	retail	\N
897	Dawud Khan	0371-9090909	Bela	26000.00	15800.00	2026-01-19 14:33:01.012952	active	special	\N
905	Shuaib Ahmed	0379-8888888	Mastung	20000.00	9600.00	2026-01-19 14:33:01.012952	active	wholesale	\N
907	Salih Khan	0381-1010101	Chaman	8100.00	-2500.00	2026-01-19 14:33:01.012952	active	retail	\N
915	Suleman Ali	0389-9090909	Barkhan	5800.00	-5000.00	2026-01-19 14:33:01.012952	active	retail	\N
917	Ishaq Khan	0391-2222222	Sherani	28000.00	17000.00	2026-01-19 14:33:01.012952	active	special	\N
925	Zakariya Ali	0399-0000000	Washuk	29000.00	17800.00	2026-01-19 14:33:01.012952	active	special	\N
927	Idris Khan	0300-1111113	Lasbela	6300.00	-5100.00	2026-01-19 14:33:01.012952	active	retail	\N
829	Ali Raza	0303-4444444	Faisalabad	10000.00	-1600.00	2026-01-19 14:33:01.012952	active	wholesale	\N
831	Zain Malik	0305-6666666	Multan	7500.00	-4300.00	2026-01-19 14:33:01.012952	active	retail	\N
833	Umar Farooq	0307-8888888	Sialkot	15000.00	3000.00	2026-01-19 14:33:01.012952	active	wholesale	\N
839	Kamran Ali	0313-5050505	Sukkur	8000.00	-4200.00	2026-01-19 14:33:01.012952	active	retail	\N
841	Rashid Ahmed	0315-7070707	Sheikhupura	20000.00	7600.00	2026-01-19 14:33:01.012952	active	special	\N
843	Asif Malik	0317-9090909	Gujrat	6000.00	-6600.00	2026-01-19 14:33:01.012952	active	retail	\N
849	Aamir Raza	0323-6666666	Sahiwal	25000.00	12200.00	2026-01-19 14:33:01.012952	active	special	\N
851	Shoaib Khan	0325-8888888	Chiniot	9000.00	-4000.00	2026-01-19 14:33:01.012952	active	retail	\N
853	Junaid Ahmed	0327-1010101	Hafizabad	14000.00	800.00	2026-01-19 14:33:01.012952	active	wholesale	\N
859	Rayyan Khan	0333-7070707	Shikarpur	5000.00	-8400.00	2026-01-19 14:33:01.012952	active	retail	\N
861	Muneeb Ahmed	0335-9090909	Sukkur	16000.00	2400.00	2026-01-19 14:33:01.012952	active	wholesale	\N
863	Zubair Khan	0337-2222222	Ghotki	8500.00	-5300.00	2026-01-19 14:33:01.012952	active	retail	\N
869	Yusuf Ahmed	0343-8888888	Badin	13000.00	-1000.00	2026-01-19 14:33:01.012952	active	wholesale	\N
871	Younis Ali	0345-1010101	Tando Allahyar	9500.00	-4700.00	2026-01-19 14:33:01.012952	active	retail	\N
873	Haroon Khan	0347-3030303	Digri	17000.00	2600.00	2026-01-19 14:33:01.012952	active	wholesale	\N
879	Sulaiman Raza	0353-9090909	Chhor	7200.00	-7400.00	2026-01-19 14:33:01.012952	active	retail	\N
881	Suleman Ali	0355-2222222	Islamkot	21000.00	6200.00	2026-01-19 14:33:01.012952	active	special	\N
883	Ishaq Khan	0357-4444444	Mithiani	8800.00	-6200.00	2026-01-19 14:33:01.012952	active	retail	\N
889	Hud Raza	0363-1010101	Moro	23000.00	7800.00	2026-01-19 14:33:01.012952	active	special	\N
891	Zakariya Ali	0365-3030303	Mehrabpur	7800.00	-7600.00	2026-01-19 14:33:01.012952	active	retail	\N
893	Idris Khan	0367-5050505	Bhirkan	24000.00	8400.00	2026-01-19 14:33:01.012952	active	special	\N
899	Yaqub Ahmed	0373-2222222	Pasni	9200.00	-6600.00	2026-01-19 14:33:01.012952	active	retail	\N
901	Ismail Ali	0375-4444444	Turbat	18000.00	2000.00	2026-01-19 14:33:01.012952	active	wholesale	\N
903	Yusuf Khan	0377-6666666	Khuzdar	7400.00	-8800.00	2026-01-19 14:33:01.012952	active	retail	\N
909	Yahya Ahmed	0383-3030303	Loralai	27000.00	10600.00	2026-01-19 14:33:01.012952	active	special	\N
911	Ilyas Malik	0385-5050505	Sibi	6600.00	-10000.00	2026-01-19 14:33:01.012952	active	retail	\N
913	Sulaiman Raza	0387-7070707	Jaffarabad	19000.00	2200.00	2026-01-19 14:33:01.012952	active	wholesale	\N
1	Zentrya Solutions	3924	09234	50000.00	43800.00	2026-01-19 13:08:54.761678	active	walk-in	\N
\.


--
-- Data for Name: daily_expenses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_expenses (expense_id, expense_category, amount, expense_date, payment_method, notes, created_at) FROM stdin;
2	Electricity	550.00	2025-11-18	card	Expense #1 - Electricity	2026-01-19 14:33:01.012952
3	Water	600.00	2026-01-19	bank_transfer	Expense #2 - Water	2026-01-19 14:33:01.012952
4	Internet	650.00	2025-11-22	cash	Expense #3 - Internet	2026-01-19 14:33:01.012952
5	Phone	700.00	2025-10-05	card	Expense #4 - Phone	2026-01-19 14:33:01.012952
6	Transportation	750.00	2025-09-22	bank_transfer	Expense #5 - Transportation	2026-01-19 14:33:01.012952
7	Staff Salary	800.00	2025-09-04	cash	Expense #6 - Staff Salary	2026-01-19 14:33:01.012952
8	Maintenance	850.00	2025-09-20	card	Expense #7 - Maintenance	2026-01-19 14:33:01.012952
9	Stationery	900.00	2026-01-16	bank_transfer	Expense #8 - Stationery	2026-01-19 14:33:01.012952
10	Marketing	950.00	2025-11-23	cash	Expense #9 - Marketing	2026-01-19 14:33:01.012952
11	Utilities	1000.00	2026-01-11	card	Expense #10 - Utilities	2026-01-19 14:33:01.012952
12	Insurance	1050.00	2025-09-12	bank_transfer	Expense #11 - Insurance	2026-01-19 14:33:01.012952
13	Tax	1100.00	2025-07-26	cash	Expense #12 - Tax	2026-01-19 14:33:01.012952
14	Miscellaneous	1150.00	2025-12-12	card	Expense #13 - Miscellaneous	2026-01-19 14:33:01.012952
15	Office Supplies	1200.00	2025-12-01	bank_transfer	Expense #14 - Office Supplies	2026-01-19 14:33:01.012952
16	Cleaning	1250.00	2025-11-06	cash	Expense #15 - Cleaning	2026-01-19 14:33:01.012952
17	Security	1300.00	2025-11-25	card	Expense #16 - Security	2026-01-19 14:33:01.012952
18	Repairs	1350.00	2025-11-20	bank_transfer	Expense #17 - Repairs	2026-01-19 14:33:01.012952
19	Fuel	1400.00	2025-09-23	cash	Expense #18 - Fuel	2026-01-19 14:33:01.012952
20	Food	1450.00	2025-09-06	card	Expense #19 - Food	2026-01-19 14:33:01.012952
21	Rent	1500.00	2025-11-27	bank_transfer	Expense #20 - Rent	2026-01-19 14:33:01.012952
22	Electricity	1550.00	2025-12-21	cash	Expense #21 - Electricity	2026-01-19 14:33:01.012952
23	Water	1600.00	2025-11-29	card	Expense #22 - Water	2026-01-19 14:33:01.012952
24	Internet	1650.00	2025-12-20	bank_transfer	Expense #23 - Internet	2026-01-19 14:33:01.012952
25	Phone	1700.00	2025-10-16	cash	Expense #24 - Phone	2026-01-19 14:33:01.012952
26	Transportation	1750.00	2025-10-01	card	Expense #25 - Transportation	2026-01-19 14:33:01.012952
27	Staff Salary	1800.00	2025-12-06	bank_transfer	Expense #26 - Staff Salary	2026-01-19 14:33:01.012952
28	Maintenance	1850.00	2025-09-24	cash	Expense #27 - Maintenance	2026-01-19 14:33:01.012952
29	Stationery	1900.00	2025-10-24	card	Expense #28 - Stationery	2026-01-19 14:33:01.012952
30	Marketing	1950.00	2025-10-10	bank_transfer	Expense #29 - Marketing	2026-01-19 14:33:01.012952
31	Utilities	2000.00	2025-10-08	cash	Expense #30 - Utilities	2026-01-19 14:33:01.012952
32	Insurance	2050.00	2025-07-26	card	Expense #31 - Insurance	2026-01-19 14:33:01.012952
33	Tax	2100.00	2025-10-13	bank_transfer	Expense #32 - Tax	2026-01-19 14:33:01.012952
34	Miscellaneous	2150.00	2025-08-18	cash	Expense #33 - Miscellaneous	2026-01-19 14:33:01.012952
35	Office Supplies	2200.00	2025-08-17	card	Expense #34 - Office Supplies	2026-01-19 14:33:01.012952
36	Cleaning	2250.00	2025-12-21	bank_transfer	Expense #35 - Cleaning	2026-01-19 14:33:01.012952
37	Security	2300.00	2026-01-03	cash	Expense #36 - Security	2026-01-19 14:33:01.012952
38	Repairs	2350.00	2025-12-13	card	Expense #37 - Repairs	2026-01-19 14:33:01.012952
39	Fuel	2400.00	2025-08-05	bank_transfer	Expense #38 - Fuel	2026-01-19 14:33:01.012952
40	Food	2450.00	2025-08-06	cash	Expense #39 - Food	2026-01-19 14:33:01.012952
41	Rent	2500.00	2025-07-29	card	Expense #40 - Rent	2026-01-19 14:33:01.012952
42	Electricity	2550.00	2025-10-17	bank_transfer	Expense #41 - Electricity	2026-01-19 14:33:01.012952
43	Water	2600.00	2025-08-26	cash	Expense #42 - Water	2026-01-19 14:33:01.012952
44	Internet	2650.00	2025-08-29	card	Expense #43 - Internet	2026-01-19 14:33:01.012952
45	Phone	2700.00	2025-12-20	bank_transfer	Expense #44 - Phone	2026-01-19 14:33:01.012952
46	Transportation	2750.00	2025-11-11	cash	Expense #45 - Transportation	2026-01-19 14:33:01.012952
47	Staff Salary	2800.00	2025-10-05	card	Expense #46 - Staff Salary	2026-01-19 14:33:01.012952
48	Maintenance	2850.00	2025-09-27	bank_transfer	Expense #47 - Maintenance	2026-01-19 14:33:01.012952
49	Stationery	2900.00	2025-10-18	cash	Expense #48 - Stationery	2026-01-19 14:33:01.012952
50	Marketing	2950.00	2025-09-19	card	Expense #49 - Marketing	2026-01-19 14:33:01.012952
51	Utilities	3000.00	2026-01-09	bank_transfer	Expense #50 - Utilities	2026-01-19 14:33:01.012952
52	Insurance	3050.00	2025-07-26	cash	Expense #51 - Insurance	2026-01-19 14:33:01.012952
53	Tax	3100.00	2025-11-17	card	Expense #52 - Tax	2026-01-19 14:33:01.012952
54	Miscellaneous	3150.00	2026-01-16	bank_transfer	Expense #53 - Miscellaneous	2026-01-19 14:33:01.012952
55	Office Supplies	3200.00	2025-12-03	cash	Expense #54 - Office Supplies	2026-01-19 14:33:01.012952
56	Cleaning	3250.00	2025-10-27	card	Expense #55 - Cleaning	2026-01-19 14:33:01.012952
57	Security	3300.00	2025-12-19	bank_transfer	Expense #56 - Security	2026-01-19 14:33:01.012952
58	Repairs	3350.00	2025-12-15	cash	Expense #57 - Repairs	2026-01-19 14:33:01.012952
59	Fuel	3400.00	2025-08-08	card	Expense #58 - Fuel	2026-01-19 14:33:01.012952
60	Food	3450.00	2025-12-21	bank_transfer	Expense #59 - Food	2026-01-19 14:33:01.012952
61	Rent	3500.00	2025-08-15	cash	Expense #60 - Rent	2026-01-19 14:33:01.012952
62	Electricity	3550.00	2025-10-01	card	Expense #61 - Electricity	2026-01-19 14:33:01.012952
63	Water	3600.00	2025-10-06	bank_transfer	Expense #62 - Water	2026-01-19 14:33:01.012952
64	Internet	3650.00	2025-12-21	cash	Expense #63 - Internet	2026-01-19 14:33:01.012952
65	Phone	3700.00	2026-01-17	card	Expense #64 - Phone	2026-01-19 14:33:01.012952
66	Transportation	3750.00	2025-09-11	bank_transfer	Expense #65 - Transportation	2026-01-19 14:33:01.012952
67	Staff Salary	3800.00	2025-11-21	cash	Expense #66 - Staff Salary	2026-01-19 14:33:01.012952
68	Maintenance	3850.00	2025-10-20	card	Expense #67 - Maintenance	2026-01-19 14:33:01.012952
69	Stationery	3900.00	2025-11-30	bank_transfer	Expense #68 - Stationery	2026-01-19 14:33:01.012952
70	Marketing	3950.00	2025-08-07	cash	Expense #69 - Marketing	2026-01-19 14:33:01.012952
71	Utilities	4000.00	2025-08-21	card	Expense #70 - Utilities	2026-01-19 14:33:01.012952
72	Insurance	4050.00	2025-12-16	bank_transfer	Expense #71 - Insurance	2026-01-19 14:33:01.012952
73	Tax	4100.00	2025-11-17	cash	Expense #72 - Tax	2026-01-19 14:33:01.012952
74	Miscellaneous	4150.00	2025-10-16	card	Expense #73 - Miscellaneous	2026-01-19 14:33:01.012952
75	Office Supplies	4200.00	2025-08-24	bank_transfer	Expense #74 - Office Supplies	2026-01-19 14:33:01.012952
76	Cleaning	4250.00	2026-01-09	cash	Expense #75 - Cleaning	2026-01-19 14:33:01.012952
77	Security	4300.00	2025-11-02	card	Expense #76 - Security	2026-01-19 14:33:01.012952
78	Repairs	4350.00	2025-09-03	bank_transfer	Expense #77 - Repairs	2026-01-19 14:33:01.012952
79	Fuel	4400.00	2025-12-31	cash	Expense #78 - Fuel	2026-01-19 14:33:01.012952
80	Food	4450.00	2025-08-30	card	Expense #79 - Food	2026-01-19 14:33:01.012952
81	Rent	4500.00	2025-11-25	bank_transfer	Expense #80 - Rent	2026-01-19 14:33:01.012952
82	Electricity	4550.00	2025-12-25	cash	Expense #81 - Electricity	2026-01-19 14:33:01.012952
83	Water	4600.00	2025-08-13	card	Expense #82 - Water	2026-01-19 14:33:01.012952
84	Internet	4650.00	2026-01-18	bank_transfer	Expense #83 - Internet	2026-01-19 14:33:01.012952
85	Phone	4700.00	2025-12-17	cash	Expense #84 - Phone	2026-01-19 14:33:01.012952
86	Transportation	4750.00	2025-12-21	card	Expense #85 - Transportation	2026-01-19 14:33:01.012952
87	Staff Salary	4800.00	2025-08-23	bank_transfer	Expense #86 - Staff Salary	2026-01-19 14:33:01.012952
88	Maintenance	4850.00	2026-01-10	cash	Expense #87 - Maintenance	2026-01-19 14:33:01.012952
89	Stationery	4900.00	2025-07-27	card	Expense #88 - Stationery	2026-01-19 14:33:01.012952
90	Marketing	4950.00	2025-12-26	bank_transfer	Expense #89 - Marketing	2026-01-19 14:33:01.012952
91	Utilities	5000.00	2025-11-18	cash	Expense #90 - Utilities	2026-01-19 14:33:01.012952
92	Insurance	5050.00	2026-01-11	card	Expense #91 - Insurance	2026-01-19 14:33:01.012952
93	Tax	5100.00	2025-10-25	bank_transfer	Expense #92 - Tax	2026-01-19 14:33:01.012952
94	Miscellaneous	5150.00	2026-01-18	cash	Expense #93 - Miscellaneous	2026-01-19 14:33:01.012952
95	Office Supplies	5200.00	2025-09-15	card	Expense #94 - Office Supplies	2026-01-19 14:33:01.012952
96	Cleaning	5250.00	2026-01-13	bank_transfer	Expense #95 - Cleaning	2026-01-19 14:33:01.012952
97	Security	5300.00	2025-09-22	cash	Expense #96 - Security	2026-01-19 14:33:01.012952
98	Repairs	5350.00	2025-08-30	card	Expense #97 - Repairs	2026-01-19 14:33:01.012952
99	Fuel	5400.00	2025-12-09	bank_transfer	Expense #98 - Fuel	2026-01-19 14:33:01.012952
100	Food	5450.00	2025-10-28	cash	Expense #99 - Food	2026-01-19 14:33:01.012952
101	Rent	5500.00	2025-09-12	card	Expense #100 - Rent	2026-01-19 14:33:01.012952
\.


--
-- Data for Name: encryption_keys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.encryption_keys (key_id, key_name, encrypted_key, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: license_info; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.license_info (id, license_id, tenant_id, license_key, device_id, device_fingerprint, expires_at, last_validated_at, validation_count, is_active, features, max_users, max_devices, app_version, created_at, updated_at, last_verified_at, pending_status, pending_status_count, activated_at, last_known_valid_date, tenant_name, status) FROM stdin;
9	5e9fb087-6780-4d87-ba16-c20f95bd9c53	Muzammil Te	a31a15cccb147305ca3c198dc6bbec24:1422bdfb2402941c6bc2930bded2ed93dc40e70fd32c447a730277c0de534294	0488783f-03d3-4f49-9860-fcf6c1438271	1e3d9f54dffbca6939642dee537b39bb:de6e1f9598090d8ec58fec543f0fedcd02a4cfd51f49ed4edb0c2bd6fb5318a66757dd10097271ffb9ef6cac1cd266c6ff8f77b2bff526987fedf281c49e6df43ca5fc8cc43739ee9e5bac7b3c00b481	2026-01-26 00:00:00	2026-01-26 02:05:36.559116	3	f	{"reports": true, "maxDevices": 3, "profitLoss": true}	3	3	1.0.0	2026-01-24 03:06:42.341592	2026-01-26 02:05:36.559116	2026-01-26 02:05:36.55385	\N	0	2026-01-24 03:06:42.341592	2026-01-26 00:00:00	\N	revoked
10	ca5379f3-ee14-46cf-8248-01e68578ee7c	new browser tenant	d1e3fb330afb1cc892c1e76ed93a6472:7e3a62816161f29a4aeb9d4d31d222ee57090d9c818601802de2fe0ebdb12e20	0488783f-03d3-4f49-9860-fcf6c1438271	d6991a7e9948560d9a8940856bf4f44b:0f803715cbeed0429ff85d54d75d49c3b27cd689972e3f77dfd5620ca6c0edf812e9b00e43e728da24b2b53be78bff7153aebd88b07d193b120f7bb1ba41f2e13288cb293a77a4aa1618def5da1590ea	2026-01-27 00:00:00	2026-01-26 02:05:36.559116	2	t	{"reports": true, "maxDevices": 3, "profitLoss": true}	3	3	1.0.0	2026-01-24 05:18:57.119706	2026-01-26 02:05:36.559116	2026-01-26 02:05:36.55385	\N	0	2026-01-24 05:18:57.119706	2026-01-26 00:00:00	\N	\N
\.


--
-- Data for Name: license_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.license_logs (id, license_key, device_id, action, status, message, error_details, ip_address, user_agent, created_at) FROM stdin;
1	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /, Method: GET	\N	\N	2026-01-23 03:52:56.030607
2	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /, Method: GET	\N	\N	2026-01-23 03:57:27.893203
3	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /, Method: GET	\N	\N	2026-01-23 03:59:47.394179
4	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:02:27.360331
5	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:02:27.423144
6	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:02:27.497816
7	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:03:42.376776
8	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:08:21.762698
9	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:08:21.803572
10	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:08:21.865652
11	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:08:36.467737
12	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:08:50.601363
13	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:17:22.326742
14	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:17:22.375486
15	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:17:22.526857
16	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:19:33.844528
17	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:19:33.8826
18	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:19:33.942625
19	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:20:21.430085
20	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:22.890622
21	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:25.813387
22	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:26.47107
23	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:26.977342
24	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:27.484917
25	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:21:28.007628
26	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:25:38.841436
27	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:25:38.879764
28	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:25:38.965841
29	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:26:26.795168
30	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:31:48.271483
31	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:31:48.303775
32	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:31:48.365935
33	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:32:00.438982
34	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:38:50.041399
35	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:38:50.077737
36	\N	0000000022fdbcf5	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:38:50.141734
37	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/validate, Method: POST	\N	\N	2026-01-23 04:38:55.708859
38	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:26.117548
39	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:26.133429
40	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:26.185415
41	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:41.234119
42	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:41.253617
43	\N	000000007a7db5e3	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/api/license/status, Method: GET	\N	\N	2026-01-23 04:40:41.268707
44	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.367898
45	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.436483
1281	72ceaab6fdf49c34	0000000022fdbcf5	activation	success	License activated successfully	\N	\N	\N	2026-01-23 23:45:55.437397
46	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.465923
47	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.509741
48	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.536625
49	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.56318
50	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.620586
51	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.644848
52	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.683693
53	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.711852
54	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.737395
55	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.772754
56	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.802305
58	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.861826
59	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.897537
67	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.17068
70	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.26829
71	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.311737
82	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.675292
88	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.869949
89	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.910232
90	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.942693
91	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.971555
92	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.02106
93	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.052064
94	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.093412
96	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.151298
97	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.194046
98	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.217509
99	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.252977
100	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.281763
104	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.407797
107	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.512464
109	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.592986
111	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.660215
113	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.72336
115	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.808911
118	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.902329
119	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.953177
121	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.02062
123	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.08662
124	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.122597
126	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.19224
129	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.320431
130	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.363631
131	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.404314
133	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.458526
57	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.828303
60	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.923909
61	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:00.980286
62	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.017459
63	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.045764
64	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.079193
65	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.100789
66	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.136228
68	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.205198
69	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.245834
72	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.338308
73	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.379613
74	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.413499
75	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.445777
76	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.479186
77	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.51233
78	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.542554
79	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.579154
80	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.609305
81	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.651558
83	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.705828
84	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.745655
85	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.776135
86	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.804574
87	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:01.838789
95	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.118903
101	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.304698
102	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.343381
103	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.374389
105	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.443059
106	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.481333
108	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.550205
110	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.62687
112	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.691117
114	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.764184
116	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.843191
117	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.878622
120	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:02.987408
122	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.055016
125	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.157164
127	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.22054
128	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.283353
132	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.430954
134	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.482999
136	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.543751
135	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.512768
137	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.570791
138	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.608105
139	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.630857
141	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.675445
145	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.774753
146	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.8093
147	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.848771
148	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.89716
150	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.950516
151	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.983714
152	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.012322
153	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.034139
156	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.104394
157	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.133834
159	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.179435
160	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.210128
161	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.233105
162	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.259967
163	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.284042
164	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.313182
166	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.358254
169	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.441425
170	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.467108
172	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.517348
173	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.549459
175	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.608144
176	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.640066
178	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.681375
180	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.732949
185	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.852607
187	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.905444
188	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.932777
189	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.958177
191	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.00608
192	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.03839
194	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.088123
196	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.142127
198	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.191993
201	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.329367
202	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.374671
203	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.425007
204	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.476695
205	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.527932
206	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.550182
140	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.648984
142	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.697991
143	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.726526
144	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.752039
149	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:03.917448
154	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.054279
155	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.083583
158	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.152994
165	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.332692
167	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.383668
168	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.416798
171	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.491229
174	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.573387
177	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.657863
179	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.707908
181	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.75858
182	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.785212
183	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.811527
184	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.832416
186	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.878392
190	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:04.975317
193	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.060899
195	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.11388
197	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.165756
199	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.221004
200	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.269716
210	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.693046
212	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.751603
213	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.785033
215	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.838994
216	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.875636
217	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.899053
221	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.998593
222	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.028106
223	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.050462
226	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.121993
227	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.148624
229	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.198071
231	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.25099
233	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.300209
235	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.348486
237	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.402038
238	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.432865
240	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.481997
242	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.533074
207	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.596196
208	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.639701
209	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.663102
211	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.723879
214	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.809409
218	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.923698
219	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.955354
220	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:05.978882
224	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.072916
225	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.10036
228	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.174023
230	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.226496
232	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.275756
234	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.325088
236	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.374527
239	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.457645
241	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.510023
243	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.558958
244	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.588024
247	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.655826
248	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.68882
250	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.731419
251	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.765651
252	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.794493
253	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.820795
254	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.84981
256	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.897764
259	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.966166
261	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.020903
263	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.077052
265	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.133635
266	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.163653
270	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.273114
272	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.322111
273	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.34845
275	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.394539
278	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.472119
279	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.498435
281	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.546756
283	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.603147
284	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.631515
285	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.660744
287	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.708356
290	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.782142
292	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.831937
245	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.606009
246	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.632192
249	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.708507
255	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.873356
257	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.923009
258	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.947334
260	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:06.992118
262	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.048935
264	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.106359
267	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.19892
268	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.229645
269	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.255987
271	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.297211
274	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.368574
276	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.422605
277	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.450865
280	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.5209
282	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.575371
286	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.679321
288	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.735077
289	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.763595
291	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.807954
294	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.882317
296	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.936339
298	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.987691
299	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.011272
300	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.031035
302	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.07523
304	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.12109
305	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.143892
308	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.21845
310	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.258952
312	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.30143
314	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.34231
316	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.383319
318	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.425979
321	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.491092
323	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.533657
326	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.596378
328	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.640266
330	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.68447
334	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.760822
335	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.780303
337	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.816058
338	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.838014
293	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.863349
295	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.908884
297	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:07.963762
301	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.054166
303	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.097057
306	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.168066
307	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.196835
309	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.239435
311	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.281345
313	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.320507
315	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.362682
317	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.405129
319	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.447769
320	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.471232
322	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.512524
324	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.557433
325	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.578599
327	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.619666
329	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.662024
331	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.706262
332	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.726638
333	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.744084
336	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.796343
339	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.855037
340	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.877702
342	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.914149
351	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.075409
354	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.135905
356	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.178422
357	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.203224
359	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.24097
360	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.265484
363	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.324577
365	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.368261
366	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.39271
368	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.428431
370	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.470514
371	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.493596
372	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.510398
373	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.527637
375	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.563115
376	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.584354
379	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.643444
382	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.701182
384	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.753507
341	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.89449
343	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.936559
344	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.956941
345	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.974525
346	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:08.990758
347	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.007919
348	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.0244
349	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.041064
350	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.057734
352	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.096157
353	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.118107
355	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.157495
358	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.220384
361	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.285222
362	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.308147
364	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.34534
367	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.409254
369	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.448419
374	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.54368
377	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.601984
378	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.625725
380	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.66388
381	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.685281
383	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.723323
388	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.823983
391	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.885128
395	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.962181
397	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.002433
399	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.043652
400	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.06786
404	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.137282
405	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.159122
406	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.175125
408	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.212797
410	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.254835
413	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.325638
415	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.36705
416	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.392068
417	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.414739
419	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.453558
420	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.475474
422	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.51568
424	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.556655
425	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.578053
427	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.619882
385	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.774955
386	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.79124
387	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.80771
389	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.843771
390	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.865496
392	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.904567
393	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.925351
394	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.942075
396	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:09.982417
398	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.022316
401	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.084898
402	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.104946
403	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.121544
407	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.192509
409	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.235215
411	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.275955
412	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.303238
414	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.344881
418	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.433343
421	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.493669
423	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.536184
426	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.595458
428	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.646254
430	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.689
432	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.727901
433	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.748509
435	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.784602
436	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.810827
437	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.827236
439	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.86247
440	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.885034
442	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.920385
444	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.960603
445	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.982712
447	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.020292
448	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.041357
449	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.058029
451	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.097857
454	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.160673
455	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.183555
458	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.237387
459	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.257573
460	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.27537
461	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.29322
462	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.310309
429	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.668464
431	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.708787
434	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.763428
438	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.843151
441	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.901219
443	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.940591
446	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:10.999581
450	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.075449
452	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.118913
453	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.139527
456	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.19992
457	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.221173
463	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.328004
464	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.349116
468	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.418421
469	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.441138
470	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.459219
473	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.523785
474	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.543882
475	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.560836
477	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.599421
480	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.661428
481	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.686746
482	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.705348
483	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.723281
485	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.761266
487	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.805335
492	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.899747
496	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.978647
498	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.020749
500	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.061158
502	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.10407
503	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.124332
505	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.160089
506	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.181457
508	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.217884
509	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.238303
512	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.291243
513	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.311015
515	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.349164
516	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.373592
517	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.397587
519	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.433952
521	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.474839
523	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.524598
465	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.365002
466	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.384797
467	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.401273
471	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.484252
472	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.507099
476	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.577338
478	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.622978
479	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.644435
484	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.739399
486	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.785014
488	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.825807
489	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.849003
490	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.865208
491	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.88366
493	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.919441
494	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.940858
495	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:11.962111
497	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.000275
499	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.041948
501	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.083941
504	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.140284
507	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.196117
510	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.253746
511	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.274434
514	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.326863
518	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.412398
520	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.454059
522	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.502351
524	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.546104
526	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.590188
528	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.634132
530	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.676323
532	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.71811
534	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.75801
537	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.812719
539	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.853466
542	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.91344
548	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.020348
550	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.060087
553	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.118373
555	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.159298
557	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.200912
559	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.24673
560	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.267891
562	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.306181
525	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.568713
527	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.611453
529	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.65585
531	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.697249
533	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.738469
535	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.777307
536	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.79736
538	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.833723
540	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.875263
541	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.898016
543	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.933789
544	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.954124
545	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.971984
546	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:12.988144
547	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.00443
549	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.040163
551	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.082278
552	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.102712
554	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.139698
556	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.180132
558	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.223522
561	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.286279
563	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.325957
565	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.367121
567	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.409503
571	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.491587
573	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.536067
574	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.558534
576	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.595874
578	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.635214
580	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.674384
582	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.715024
584	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.75555
586	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.795768
588	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.837472
590	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.883727
591	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.907318
593	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.945978
595	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.986249
597	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.026277
598	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.049769
599	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.067037
600	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.088697
603	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.156433
606	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.220935
564	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.346701
566	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.388997
568	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.433124
569	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.454444
570	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.472353
572	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.515536
575	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.575397
577	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.615837
579	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.654849
581	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.694612
583	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.734703
585	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.775116
587	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.816548
589	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.859448
592	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.924691
594	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:13.966077
596	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.00575
601	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.105248
602	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.129661
604	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.179917
605	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.203576
607	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.241288
608	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.26628
610	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.30374
612	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.342506
613	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.365088
614	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.383384
615	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.399768
617	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.438939
619	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.480901
621	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.521192
623	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.562022
625	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.603682
627	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.642431
629	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.685308
630	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.705857
631	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.72185
633	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.758153
636	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.816602
638	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.856141
641	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.911889
643	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.95498
645	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.000021
647	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.050494
649	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.090014
609	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.283042
611	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.322679
616	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.4168
618	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.459961
620	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.500873
622	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.541063
624	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.583139
626	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.62307
628	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.66467
632	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.738873
634	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.780495
635	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.800638
637	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.836793
639	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.87549
640	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.89641
642	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.934233
644	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:14.976095
646	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.022221
648	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.070616
650	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.109668
652	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.149885
654	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.191435
655	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.212834
656	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.22908
657	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.245509
660	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.297549
662	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.340032
664	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.3821
666	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.422193
668	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.463245
669	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.483032
671	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.524426
673	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.565346
675	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.60615
677	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.645821
678	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.670342
682	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.738568
684	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.779892
686	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.819527
688	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.858578
690	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.904473
693	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.96492
694	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.990073
696	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.024297
698	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.064769
651	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.13029
653	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.170658
658	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.260341
659	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.281841
661	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.3175
663	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.36046
665	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.401927
667	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.441149
670	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.498742
672	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.543799
674	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.586806
676	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.625486
679	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.687957
680	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.707303
681	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.723069
683	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.757598
685	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.799374
687	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.839565
689	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.881794
691	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.925319
692	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:15.948084
695	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.005277
697	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.044861
699	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.08454
701	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.123873
702	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.145026
704	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.182527
706	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.222313
708	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.262243
710	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.301536
712	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.34219
714	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.382384
716	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.423659
719	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.488095
721	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.528208
722	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.548427
724	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.586226
726	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.624821
728	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.664961
730	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.705362
732	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.74804
734	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.79521
736	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.834969
738	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.874306
741	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.931171
700	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.104492
703	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.160571
705	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.202744
707	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.241413
709	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.28203
711	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.321537
713	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.360602
715	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.401933
717	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.44653
718	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.466713
720	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.507439
723	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.564438
725	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.605507
727	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.645433
729	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.685404
731	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.725155
733	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.770868
735	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.815176
737	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.854984
739	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.895584
740	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.915468
743	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.968894
745	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.017631
746	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.039342
748	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.077098
750	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.120328
752	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.161877
754	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.203371
756	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.241989
758	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.281364
760	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.321611
761	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.341991
763	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.378437
765	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.419444
768	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.474779
769	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.497809
770	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.516911
772	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.557802
774	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.603309
776	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.647577
781	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.743257
784	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.810614
786	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.850075
787	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.871474
789	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.909356
742	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.952112
744	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:16.991409
747	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.055964
749	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.09873
751	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.141537
753	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.182946
755	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.222182
757	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.261753
759	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.301393
762	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.357113
764	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.398818
766	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.438775
767	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.459767
771	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.537326
773	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.580771
775	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.625102
777	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.670841
778	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.69202
779	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.708636
780	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.727455
782	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.762325
783	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.789693
785	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.829885
788	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.886965
790	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.930894
792	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.979842
794	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.027552
796	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.070052
798	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.110698
800	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.152242
802	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.194956
804	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.238997
806	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.281437
807	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.30369
809	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.339751
811	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.38272
813	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.421612
815	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.462158
817	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.501207
819	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.543585
821	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.600136
823	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.645022
825	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.686662
827	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.727337
829	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.768365
791	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:17.955007
793	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.006821
795	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.049686
797	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.090158
799	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.132255
801	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.173154
803	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.217316
805	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.260336
808	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.320031
810	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.359202
812	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.402451
814	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.442462
816	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.481081
818	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.520541
820	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.567621
822	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.622383
824	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.666284
826	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.706061
828	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.74828
830	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.789005
832	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.829151
834	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.870985
836	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.911444
838	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.953664
840	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.995988
842	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.045332
844	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.088427
846	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.13388
848	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.177857
850	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.219011
852	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.260419
853	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.280438
855	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.320365
857	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.362183
859	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.404056
863	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.484342
866	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.564218
868	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.610528
870	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.650557
872	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.691338
873	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.713178
875	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.749149
877	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.793305
879	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.83657
881	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.881497
831	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.809342
833	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.850835
835	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.891972
837	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.932632
839	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:18.975065
841	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.021146
843	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.067194
845	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.111499
847	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.154246
849	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.199486
851	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.239795
854	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.300618
856	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.341855
858	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.383919
860	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.425458
861	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.446965
862	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.465633
864	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.509931
865	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.536259
867	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.588823
869	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.630617
871	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.670339
874	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.728728
876	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.768903
878	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.814631
880	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.858828
882	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.902044
884	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.948797
885	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.970301
887	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.012426
889	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.056021
891	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.099802
893	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.143937
895	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.194777
897	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.241752
899	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.283592
901	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.326648
903	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.368992
906	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.432205
908	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.474904
910	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.515892
912	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.562839
914	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.60831
916	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.650557
918	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.693342
883	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.927296
886	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:19.988972
888	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.034709
890	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.077775
892	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.119796
894	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.167511
896	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.216754
898	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.262204
900	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.304284
902	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.348435
904	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.39268
905	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.41578
907	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.452628
909	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.494343
911	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.538861
913	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.584641
915	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.630636
917	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.670503
919	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.713261
921	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.755996
923	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.798979
925	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.840317
927	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.880199
929	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.920059
933	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.998483
935	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.040342
937	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.08059
939	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.120387
941	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.164284
943	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.20919
944	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.23457
946	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.272986
949	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.334994
951	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.517204
953	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.595949
955	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.63865
957	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.68733
958	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.714199
960	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.765158
962	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.808992
964	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.849541
966	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.890067
968	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.930879
970	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.97344
972	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.016788
920	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.734529
922	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.777144
924	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.819244
926	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.85957
928	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.900115
930	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.942613
931	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.964059
932	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:20.981301
934	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.018196
936	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.060241
938	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.10039
940	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.14449
942	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.185771
945	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.25107
947	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.292974
948	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.313515
950	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.357327
952	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.571855
954	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.617098
956	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.664607
959	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.744017
961	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.785925
963	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.829016
965	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.869306
967	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.910953
969	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.952347
971	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:21.996739
974	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.056644
976	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.100735
978	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.142723
979	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.164879
980	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.18501
982	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.225118
984	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.272192
988	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.348949
990	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.389929
992	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.431973
994	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.474844
996	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.516723
997	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.539132
999	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.57471
1001	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.61551
1003	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.660823
1005	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.705891
1008	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.764899
973	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.038624
975	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.08021
977	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.121885
981	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.203302
983	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.245472
985	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.292768
986	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.314804
987	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.332616
989	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.368775
991	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.410919
993	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.452779
995	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.495737
998	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.555134
1000	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.595512
1002	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.638623
1004	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.683944
1006	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.726652
1007	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.748548
1009	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.788181
1011	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.832391
1013	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.876029
1015	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.917953
1017	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.959979
1019	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.001872
1021	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.042125
1023	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.083149
1025	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.125244
1027	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.166464
1031	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.25034
1033	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.293506
1035	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.335647
1037	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.378041
1039	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.419477
1041	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.460284
1043	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.500192
1045	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.543602
1047	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.590018
1049	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.642447
1051	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.682681
1053	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.725851
1055	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.767389
1057	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.810368
1059	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.853479
1061	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.896179
1063	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.938793
1010	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.811167
1012	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.854391
1014	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.896892
1016	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.940308
1018	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:22.980961
1020	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.023165
1022	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.063844
1024	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.10569
1026	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.146369
1028	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.189581
1029	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.212485
1030	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.228329
1032	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.272116
1034	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.31406
1036	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.357462
1038	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.399202
1040	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.440562
1042	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.480499
1044	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.523121
1046	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.565303
1048	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.615384
1050	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.663082
1052	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.703665
1054	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.747468
1056	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.789612
1058	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.830645
1060	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.874541
1062	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.916183
1064	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.958271
1066	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.004208
1068	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.04625
1070	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.088234
1072	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.129548
1076	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.212163
1078	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.256873
1080	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.303987
1082	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.348385
1084	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.39039
1086	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.431891
1088	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.473654
1091	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.53947
1093	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.60542
1096	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.665315
1098	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.708462
1100	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.753153
1065	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:23.979564
1067	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.025753
1069	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.066594
1071	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.107854
1073	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.15009
1074	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.176391
1075	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.195188
1077	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.234162
1079	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.278746
1081	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.327493
1083	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.369486
1085	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.412053
1087	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.453805
1089	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.494216
1090	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.514427
1092	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.565123
1094	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.627929
1095	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.649574
1097	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.686796
1099	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.729562
1101	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.775081
1103	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.821998
1105	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.86431
1107	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.906543
1109	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.950972
1112	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.011201
1114	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.05228
1116	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.094827
1118	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.13648
1120	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.178546
1122	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.22096
1124	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.264596
1127	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.329686
1129	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.374946
1131	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.419816
1133	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.461427
1136	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.529428
1138	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.582758
1140	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.627551
1142	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.671898
1144	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.713833
1146	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.757008
1148	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.804201
1150	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.846253
1152	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.888885
1102	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.799552
1104	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.842967
1106	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.885848
1108	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.928369
1110	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.9715
1111	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:24.993957
1113	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.031234
1115	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.073736
1117	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.114729
1119	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.157387
1121	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.199418
1123	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.24334
1125	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.286918
1126	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.308691
1128	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.353327
1130	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.397062
1132	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.440935
1134	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.483904
1135	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.510545
1137	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.554362
1139	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.607001
1141	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.649253
1143	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.693274
1145	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.735928
1147	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.779615
1149	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.825758
1151	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.868254
1153	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.910819
1155	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.954861
1157	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.996312
1159	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.039638
1161	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.080449
1163	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.121762
1166	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.178852
1168	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.221642
1170	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.263107
1172	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.306177
1174	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.347095
1176	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.389889
1178	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.430989
1180	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.47964
1182	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.528681
1184	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.570795
1186	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.612961
1188	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.654441
1154	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.931502
1156	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:25.975136
1158	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.018126
1160	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.060186
1162	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.101832
1164	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.14247
1165	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.163418
1167	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.201246
1169	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.243152
1171	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.28351
1173	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.326547
1175	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.368301
1177	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.411241
1179	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.455072
1181	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.503089
1183	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.550528
1185	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.591573
1187	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.633863
1189	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.67492
1191	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.714769
1193	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.757687
1195	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.801369
1197	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.845211
1199	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.887068
1201	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.927443
1203	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.969728
1205	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.01228
1207	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.054233
1210	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.11151
1212	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.155684
1214	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.195783
1215	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:49:28.060048
1217	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:50:17.721441
1218	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 04:50:19.233554
1227	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 04:50:25.387289
1228	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/expenses, Method: GET	\N	\N	2026-01-23 04:50:26.170106
1229	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 04:50:27.232627
1232	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/suppliers, Method: GET	\N	\N	2026-01-23 04:50:28.116044
1235	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 04:50:28.165433
1236	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 04:50:28.906067
1237	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 04:50:29.774298
1238	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:50:30.898539
1240	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:51:32.092693
1241	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:52:01.760133
1244	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 19:44:19.900315
1283	59306b7e52b2b5d9	000000007a7db5e3	activation	success	License activated successfully	\N	\N	\N	2026-01-24 01:19:44.604696
1190	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.694881
1192	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.736726
1194	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.778658
1196	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.824825
1198	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.865346
1200	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.907347
1202	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.947903
1204	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:26.989892
1206	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.032601
1208	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.074536
1209	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.096183
1211	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.132274
1213	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:46:27.176011
1216	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:49:57.80693
1219	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 04:50:19.234139
1220	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 04:50:19.279738
1221	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 04:50:20.341447
1222	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 04:50:20.345161
1223	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 04:50:23.253544
1224	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 04:50:24.298157
1225	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/purchases, Method: GET	\N	\N	2026-01-23 04:50:25.383728
1226	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 04:50:25.38583
1230	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 04:50:27.233015
1231	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/products, Method: GET	\N	\N	2026-01-23 04:50:28.11268
1233	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard-summary, Method: GET	\N	\N	2026-01-23 04:50:28.117072
1234	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard-summary, Method: GET	\N	\N	2026-01-23 04:50:28.133152
1239	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 04:51:01.80184
1242	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:44:15.033914
1243	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:44:19.833161
1245	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 19:44:19.903955
1246	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:44:21.472489
1247	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 19:44:21.472808
1248	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:44:25.035139
1249	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:44:32.693145
1250	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 19:44:32.704571
1251	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 19:44:32.715501
1252	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 19:44:33.393847
1253	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 19:44:34.057725
1254	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/purchases, Method: GET	\N	\N	2026-01-23 19:44:35.374557
1255	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 19:44:35.37479
1256	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:44:35.377398
1257	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/expenses, Method: GET	\N	\N	2026-01-23 19:44:36.197702
1258	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:44:38.450816
1259	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:44:38.452851
1260	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 19:44:39.587117
1261	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:44:54.989863
1262	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 19:44:57.980367
1263	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:44:59.387865
1267	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 19:45:03.387441
1268	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:45:03.399315
1264	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:44:59.388865
1265	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/expenses, Method: GET	\N	\N	2026-01-23 19:45:01.417873
1266	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/purchases, Method: GET	\N	\N	2026-01-23 19:45:03.386405
1269	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 19:45:50.680865
1270	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: POST	\N	\N	2026-01-23 19:46:03.118507
1271	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:46:53.473452
1272	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:47:23.559374
1273	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:47:53.876696
1274	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:48:23.838412
1275	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/reports/dashboard, Method: GET	\N	\N	2026-01-23 19:50:18.356593
1276	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/products, Method: GET	\N	\N	2026-01-23 19:50:21.213601
1277	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/customers, Method: GET	\N	\N	2026-01-23 19:50:21.267968
1278	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/settings, Method: GET	\N	\N	2026-01-23 19:50:21.273342
1279	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/suppliers, Method: GET	\N	\N	2026-01-23 19:50:22.25132
1280	\N	ca20eaf9179e1a95	blocked_request	failed	Request blocked: License invalid or expired	Path: /api/categories, Method: GET	\N	\N	2026-01-23 19:50:22.251668
1282	72ceaab6fdf49c34	0000000022fdbcf5	server_revocation_pending	info	License revocation pending confirmation	\N	\N	\N	2026-01-23 23:46:18.080294
1284	c1dd002f51559d1d	000000007a7db5e3	activation	success	License activated successfully	\N	\N	\N	2026-01-24 02:16:57.447846
1285	c1dd002f51559d1d	ffd85b03-b657-472a-a64b-e3964ffb2450	activation	success	License activated successfully	\N	\N	\N	2026-01-24 03:04:42.00906
1286	c1dd002f51559d1d	0488783f-03d3-4f49-9860-fcf6c1438271	activation	success	License activated successfully	\N	\N	\N	2026-01-24 03:06:42.343643
1287	178023b9fb498bf5	ffd85b03-b657-472a-a64b-e3964ffb2450	activation	success	License activated successfully	\N	\N	\N	2026-01-24 05:18:57.127096
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (notification_id, user_id, title, message, type, read, created_at, link, metadata) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (product_id, name, sku, category, purchase_price, selling_price, quantity_in_stock, supplier_id, barcode, tax_percentage, status, category_id, sub_category_id, item_name_english, item_name_urdu, retail_price, wholesale_price, special_price, unit_type, is_frequently_sold, display_order) FROM stdin;
417	TV Remote	\N	\N	50.00	80.00	120	990	\N	0.00	active	274	\N	TV Remote	\N	80.00	65.00	70.00	piece	t	0
293	LED Bulb 9W	SKU-1014	\N	102.50	153.75	56	\N	\N	0.00	active	286	1104	LED Bulb 9W	\N	153.75	123.00	133.25	box	t	15
284	XLPE Cable 4 Core	SKU-1005	\N	71.00	106.50	114	\N	\N	0.00	active	277	1074	XLPE Cable 4 Core	XLPE Cable 4 Core (اردو)	106.50	85.20	\N	piece	t	6
281	Copper Wire 4mm	SKU-1002	\N	60.50	90.75	-32	\N	\N	0.00	active	274	1059	Copper Wire 4mm	\N	90.75	72.60	\N	box	t	3
280	Copper Wire 2.5mm	SKU-1001	\N	57.00	85.50	3	984	\N	0.00	active	273	1045	Copper Wire 2.5mm	Copper Wire 2.5mm (اردو)	85.50	68.40	\N	meter	f	2
282	Aluminum Wire 2.5mm	SKU-1003	\N	64.00	96.00	15	986	\N	0.00	active	275	1062	Aluminum Wire 2.5mm	Aluminum Wire 2.5mm (اردو)	96.00	76.80	\N	kg	f	4
283	PVC Cable 3 Core	SKU-1004	\N	67.50	101.25	8	987	\N	0.00	active	276	1068	PVC Cable 3 Core	\N	101.25	81.00	87.75	roll	f	5
1	Test Product	Kg	ABC Category	500.00	600.00	1	1	\N	0.00	active	1	\N	Test Product	\N	600.00	600.00	\N	piece	f	0
285	Armored Cable 3x4	SKU-1006	\N	74.50	111.75	10	989	\N	0.00	active	278	1078	Armored Cable 3x4	\N	111.75	89.40	\N	packet	f	7
286	Flexible Cable 2.5mm	SKU-1007	\N	78.00	117.00	18	990	\N	0.00	active	279	1081	Flexible Cable 2.5mm	Flexible Cable 2.5mm (اردو)	117.00	93.60	\N	meter	f	8
287	Single Pole Switch	SKU-1008	\N	81.50	122.25	7	\N	\N	0.00	active	280	1083	Single Pole Switch	\N	122.25	97.80	\N	box	t	9
288	Double Pole Switch	SKU-1009	\N	85.00	127.50	5	992	\N	0.00	active	281	1092	Double Pole Switch	Double Pole Switch (اردو)	127.50	102.00	110.50	kg	f	10
289	Three Way Switch	SKU-1010	\N	88.50	132.75	0	993	\N	0.00	active	282	1095	Three Way Switch	\N	132.75	106.20	\N	roll	f	11
290	Socket Outlet 13A	SKU-1011	\N	92.00	138.00	34	\N	\N	0.00	active	283	\N	Socket Outlet 13A	Socket Outlet 13A (اردو)	138.00	110.40	\N	piece	t	12
291	USB Socket	SKU-1012	\N	95.50	143.25	20	995	\N	0.00	active	284	\N	USB Socket	\N	143.25	114.60	\N	packet	f	13
292	Dimmer Switch	SKU-1013	\N	99.00	148.50	19	996	\N	0.00	active	285	1101	Dimmer Switch	Dimmer Switch (اردو)	148.50	118.80	\N	meter	f	14
294	LED Bulb 12W	SKU-1015	\N	106.00	159.00	8	998	\N	0.00	active	287	1109	LED Bulb 12W	LED Bulb 12W (اردو)	159.00	127.20	\N	kg	f	16
295	LED Bulb 18W	SKU-1016	\N	109.50	164.25	27	999	\N	0.00	active	288	1113	LED Bulb 18W	\N	164.25	131.40	\N	roll	f	17
296	CFL Bulb 23W	SKU-1017	\N	113.00	169.50	24	\N	\N	0.00	active	289	1115	CFL Bulb 23W	CFL Bulb 23W (اردو)	169.50	135.60	\N	piece	t	18
297	Tube Light 4ft	SKU-1018	\N	116.50	174.75	10	1001	\N	0.00	active	290	1120	Tube Light 4ft	\N	174.75	139.80	\N	packet	f	19
298	Panel Light 2x2	SKU-1019	\N	120.00	180.00	16	1002	\N	0.00	active	291	1123	Panel Light 2x2	Panel Light 2x2 (اردو)	180.00	144.00	156.00	meter	f	20
299	Spot Light 5W	SKU-1020	\N	123.50	185.25	31	\N	\N	0.00	active	292	1125	Spot Light 5W	\N	185.25	148.20	\N	box	t	21
300	Ceiling Fan 56"	SKU-1021	\N	127.00	190.50	20	1004	\N	0.00	active	293	\N	Ceiling Fan 56"	Ceiling Fan 56" (اردو)	190.50	152.40	\N	kg	f	22
301	Exhaust Fan 12"	SKU-1022	\N	130.50	195.75	26	1005	\N	0.00	active	294	\N	Exhaust Fan 12"	\N	195.75	156.60	\N	roll	f	23
302	Table Fan 16"	SKU-1023	\N	134.00	201.00	36	\N	\N	0.00	active	295	1129	Table Fan 16"	Table Fan 16" (اردو)	201.00	160.80	\N	piece	t	24
303	MCB 6A	SKU-1024	\N	137.50	206.25	31	1007	\N	0.00	active	296	1132	MCB 6A	\N	206.25	165.00	178.75	packet	f	25
304	MCB 10A	SKU-1025	\N	141.00	211.50	58	1008	\N	0.00	active	297	1134	MCB 10A	MCB 10A (اردو)	211.50	169.20	\N	meter	f	26
305	MCB 16A	SKU-1026	\N	144.50	216.75	21	\N	\N	0.00	active	298	1141	MCB 16A	\N	216.75	173.40	\N	box	t	27
306	MCB 20A	SKU-1027	\N	148.00	222.00	23	1010	\N	0.00	active	299	1143	MCB 20A	MCB 20A (اردو)	222.00	177.60	\N	kg	f	28
307	MCB 32A	SKU-1028	\N	151.50	227.25	30	1011	\N	0.00	active	300	1147	MCB 32A	\N	227.25	181.80	\N	roll	f	29
308	RCCB 30mA	SKU-1029	\N	155.00	232.50	48	\N	\N	0.00	active	301	1151	RCCB 30mA	RCCB 30mA (اردو)	232.50	186.00	201.50	piece	t	30
309	Cartridge Fuse 5A	SKU-1030	\N	158.50	237.75	36	1013	\N	0.00	active	1	1	Cartridge Fuse 5A	\N	237.75	190.20	\N	packet	f	31
310	PVC Conduit 20mm	SKU-1031	\N	162.00	243.00	60	1014	\N	0.00	active	272	1037	PVC Conduit 20mm	PVC Conduit 20mm (اردو)	243.00	194.40	\N	meter	f	32
311	PVC Conduit 25mm	SKU-1032	\N	165.50	248.25	40	\N	\N	0.00	active	273	1050	PVC Conduit 25mm	\N	248.25	198.60	\N	box	t	33
312	Metal Junction Box	SKU-1033	\N	169.00	253.50	37	1016	\N	0.00	active	274	1056	Metal Junction Box	Metal Junction Box (اردو)	253.50	202.80	\N	kg	f	34
313	Plastic Junction Box	SKU-1034	\N	172.50	258.75	50	1017	\N	0.00	active	275	1064	Plastic Junction Box	\N	258.75	207.00	224.25	roll	f	35
314	Screwdriver Set	SKU-1035	\N	176.00	264.00	40	\N	\N	0.00	active	276	1068	Screwdriver Set	Screwdriver Set (اردو)	264.00	211.20	\N	piece	t	36
315	Pliers Set	SKU-1036	\N	179.50	269.25	36	1019	\N	0.00	active	277	1073	Pliers Set	\N	269.25	215.40	\N	packet	f	37
316	Wire Stripper	SKU-1037	\N	183.00	274.50	45	1020	\N	0.00	active	278	1076	Wire Stripper	Wire Stripper (اردو)	274.50	219.60	\N	meter	f	38
317	Multimeter	SKU-1038	\N	186.50	279.75	39	\N	\N	0.00	active	279	1082	Multimeter	\N	279.75	223.80	\N	box	t	39
318	Drill Machine	SKU-1039	\N	190.00	285.00	20	1022	\N	0.00	active	280	1086	Drill Machine	Drill Machine (اردو)	285.00	228.00	247.00	kg	f	40
319	Safety Gloves	SKU-1040	\N	193.50	290.25	35	1023	\N	0.00	active	281	1090	Safety Gloves	\N	290.25	232.20	\N	roll	f	41
320	Safety Glasses	SKU-1041	\N	197.00	295.50	51	\N	\N	0.00	active	282	1094	Safety Glasses	Safety Glasses (اردو)	295.50	236.40	\N	piece	t	42
321	Lead Acid Battery 12V	SKU-1042	\N	200.50	300.75	54	1025	\N	0.00	active	283	\N	Lead Acid Battery 12V	\N	300.75	240.60	\N	packet	f	43
322	Lithium Battery	SKU-1043	\N	204.00	306.00	59	1026	\N	0.00	active	284	\N	Lithium Battery	Lithium Battery (اردو)	306.00	244.80	\N	meter	f	44
323	PVC Pipe 1/2"	SKU-1044	\N	207.50	311.25	45	\N	\N	0.00	active	285	1097	PVC Pipe 1/2"	\N	311.25	249.00	269.75	box	t	45
324	PVC Pipe 3/4"	SKU-1045	\N	211.00	316.50	38	1028	\N	0.00	active	286	1107	PVC Pipe 3/4"	PVC Pipe 3/4" (اردو)	316.50	253.20	\N	kg	f	46
325	GI Pipe 1"	SKU-1046	\N	214.50	321.75	50	1029	\N	0.00	active	287	1109	GI Pipe 1"	\N	321.75	257.40	\N	roll	f	47
326	CPVC Pipe 1/2"	SKU-1047	\N	218.00	327.00	74	\N	\N	0.00	active	288	1113	CPVC Pipe 1/2"	CPVC Pipe 1/2" (اردو)	327.00	261.60	\N	piece	t	48
327	Ball Valve 1/2"	SKU-1048	\N	221.50	332.25	40	1031	\N	0.00	active	289	1117	Ball Valve 1/2"	\N	332.25	265.80	\N	packet	f	49
328	Gate Valve 3/4"	SKU-1049	\N	225.00	337.50	44	1032	\N	0.00	active	290	1118	Gate Valve 3/4"	Gate Valve 3/4" (اردو)	337.50	270.00	292.50	meter	f	50
329	Check Valve 1"	SKU-1050	\N	228.50	342.75	60	\N	\N	0.00	active	291	1123	Check Valve 1"	\N	342.75	274.20	\N	box	t	51
330	Centrifugal Pump 1HP	SKU-1051	\N	232.00	348.00	75	1034	\N	0.00	active	292	1126	Centrifugal Pump 1HP	Centrifugal Pump 1HP (اردو)	348.00	278.40	\N	kg	f	52
331	Submersible Pump 0.5HP	SKU-1052	\N	235.50	353.25	60	1035	\N	0.00	active	293	\N	Submersible Pump 0.5HP	\N	353.25	282.60	\N	roll	f	53
332	Electric Water Heater 50L	SKU-1053	\N	239.00	358.50	56	\N	\N	0.00	active	294	\N	Electric Water Heater 50L	Electric Water Heater 50L (اردو)	358.50	286.80	\N	piece	t	54
333	Gas Water Heater	SKU-1054	\N	242.50	363.75	51	1037	\N	0.00	active	295	1128	Gas Water Heater	\N	363.75	291.00	315.25	packet	f	55
334	Toilet Set	SKU-1055	\N	246.00	369.00	60	1038	\N	0.00	active	296	1132	Toilet Set	Toilet Set (اردو)	369.00	295.20	\N	meter	f	56
335	Basin	SKU-1056	\N	249.50	374.25	65	\N	\N	0.00	active	297	1135	Basin	\N	374.25	299.40	\N	box	t	57
336	Faucet Single	SKU-1057	\N	253.00	379.50	48	1040	\N	0.00	active	298	1138	Faucet Single	Faucet Single (اردو)	379.50	303.60	\N	kg	f	58
337	Ceramic Tile 2x2	SKU-1058	\N	256.50	384.75	50	1041	\N	0.00	active	299	1143	Ceramic Tile 2x2	\N	384.75	307.80	\N	roll	f	59
338	Portland Cement 50kg	SKU-1059	\N	260.00	390.00	49	\N	\N	0.00	active	300	1146	Portland Cement 50kg	Portland Cement 50kg (اردو)	390.00	312.00	338.00	piece	t	60
339	Steel Bar 12mm	SKU-1060	\N	263.50	395.25	64	1043	\N	0.00	active	301	1148	Steel Bar 12mm	\N	395.25	316.20	\N	packet	f	61
340	Iron Sheet	SKU-1061	\N	267.00	400.50	85	1044	\N	0.00	active	1	1	Iron Sheet	Iron Sheet (اردو)	400.50	320.40	\N	meter	f	62
341	Door Lock	SKU-1062	\N	270.50	405.75	79	\N	\N	0.00	active	272	1037	Door Lock	\N	405.75	324.60	\N	box	t	63
342	Padlock	SKU-1063	\N	274.00	411.00	62	1046	\N	0.00	active	273	1049	Padlock	Padlock (اردو)	411.00	328.80	\N	kg	f	64
343	Door Hinge	SKU-1064	\N	277.50	416.25	72	1047	\N	0.00	active	274	1057	Door Hinge	\N	416.25	333.00	360.75	roll	f	65
344	Door Handle	SKU-1065	\N	281.00	421.50	96	\N	\N	0.00	active	275	1066	Door Handle	Door Handle (اردو)	421.50	337.20	\N	piece	t	66
345	Wood Screw 2"	SKU-1066	\N	284.50	426.75	81	1049	\N	0.00	active	276	1070	Wood Screw 2"	\N	426.75	341.40	\N	packet	f	67
346	Machine Screw	SKU-1067	\N	288.00	432.00	92	1050	\N	0.00	active	277	1072	Machine Screw	Machine Screw (اردو)	432.00	345.60	\N	meter	f	68
347	Nails 2"	SKU-1068	\N	291.50	437.25	80	\N	\N	0.00	active	278	1077	Nails 2"	\N	437.25	349.80	\N	box	t	69
348	Construction Adhesive	SKU-1069	\N	295.00	442.50	96	1052	\N	0.00	active	279	1082	Construction Adhesive	Construction Adhesive (اردو)	442.50	354.00	383.50	kg	f	70
349	Silicone Sealant	SKU-1070	\N	298.50	447.75	81	1053	\N	0.00	active	280	1086	Silicone Sealant	\N	447.75	358.20	\N	roll	f	71
350	Electrical Tape	SKU-1071	\N	302.00	453.00	98	\N	\N	0.00	active	281	1092	Electrical Tape	Electrical Tape (اردو)	453.00	362.40	\N	piece	t	72
351	Cable Ties	SKU-1072	\N	305.50	458.25	79	1055	\N	0.00	active	282	1095	Cable Ties	\N	458.25	366.60	\N	packet	f	73
352	Wire Nuts	SKU-1073	\N	309.00	463.50	98	1056	\N	0.00	active	283	\N	Wire Nuts	Wire Nuts (اردو)	463.50	370.80	\N	meter	f	74
353	Cable Clips	SKU-1074	\N	312.50	468.75	84	\N	\N	0.00	active	284	\N	Cable Clips	\N	468.75	375.00	406.25	box	t	75
354	Copper Wire 6mm	SKU-1075	\N	316.00	474.00	60	1058	\N	0.00	active	285	1099	Copper Wire 6mm	Copper Wire 6mm (اردو)	474.00	379.20	\N	kg	f	76
355	Copper Wire 10mm	SKU-1076	\N	319.50	479.25	74	1059	\N	0.00	active	286	1104	Copper Wire 10mm	\N	479.25	383.40	\N	roll	f	77
357	PVC Cable 4 Core	SKU-1078	\N	326.50	489.75	102	1061	\N	0.00	active	288	1113	PVC Cable 4 Core	\N	489.75	391.80	\N	packet	f	79
358	XLPE Cable 3 Core	SKU-1079	\N	330.00	495.00	94	1062	\N	0.00	active	289	1117	XLPE Cable 3 Core	XLPE Cable 3 Core (اردو)	495.00	396.00	429.00	meter	f	80
359	Armored Cable 3x6	SKU-1080	\N	333.50	500.25	101	\N	\N	0.00	active	290	1118	Armored Cable 3x6	\N	500.25	400.20	\N	box	t	81
360	Flexible Cable 4mm	SKU-1081	\N	337.00	505.50	92	1064	\N	0.00	active	291	1121	Flexible Cable 4mm	Flexible Cable 4mm (اردو)	505.50	404.40	\N	kg	f	82
361	Switch Socket	SKU-1082	\N	340.50	510.75	91	1065	\N	0.00	active	292	1125	Switch Socket	\N	510.75	408.60	\N	roll	f	83
362	Bell Switch	SKU-1083	\N	344.00	516.00	102	\N	\N	0.00	active	293	\N	Bell Switch	Bell Switch (اردو)	516.00	412.80	\N	piece	t	84
363	LED Bulb 24W	SKU-1084	\N	347.50	521.25	109	1067	\N	0.00	active	294	\N	LED Bulb 24W	\N	521.25	417.00	451.75	packet	f	85
364	LED Bulb 36W	SKU-1085	\N	351.00	526.50	95	1068	\N	0.00	active	295	1127	LED Bulb 36W	LED Bulb 36W (اردو)	526.50	421.20	\N	meter	f	86
365	CFL Bulb 32W	SKU-1086	\N	354.50	531.75	102	\N	\N	0.00	active	296	1132	CFL Bulb 32W	\N	531.75	425.40	\N	box	t	87
366	Tube Light 5ft	SKU-1087	\N	358.00	537.00	98	1070	\N	0.00	active	297	1137	Tube Light 5ft	Tube Light 5ft (اردو)	537.00	429.60	\N	kg	f	88
367	Panel Light 1x4	SKU-1088	\N	361.50	542.25	84	1071	\N	0.00	active	298	1141	Panel Light 1x4	\N	542.25	433.80	\N	roll	f	89
368	Spot Light 10W	SKU-1089	\N	365.00	547.50	94	\N	\N	0.00	active	299	1142	Spot Light 10W	Spot Light 10W (اردو)	547.50	438.00	474.50	piece	t	90
369	Ceiling Fan 48"	SKU-1090	\N	368.50	552.75	26	1073	\N	0.00	active	300	1146	Ceiling Fan 48"	\N	552.75	442.20	\N	packet	f	91
370	Exhaust Fan 6"	SKU-1091	\N	372.00	558.00	21	1074	\N	0.00	active	301	1151	Exhaust Fan 6"	Exhaust Fan 6" (اردو)	558.00	446.40	\N	meter	f	92
371	Table Fan 12"	SKU-1092	\N	375.50	563.25	41	\N	\N	0.00	active	1	1	Table Fan 12"	\N	563.25	450.60	\N	box	t	93
372	MCB 40A	SKU-1093	\N	379.00	568.50	1	1076	\N	0.00	active	272	1043	MCB 40A	MCB 40A (اردو)	568.50	454.80	\N	kg	f	94
356	Aluminum Wire 4mm	\N	\N	323.00	484.50	102	\N	\N	0.00	active	287	\N	Aluminum Wire 4mm	\N	484.50	387.60	\N	piece	f	78
374	RCCB 100mA	SKU-1095	\N	386.00	579.00	15	\N	\N	0.00	active	274	1058	RCCB 100mA	RCCB 100mA (اردو)	579.00	463.20	\N	piece	t	96
375	Cartridge Fuse 10A	SKU-1096	\N	389.50	584.25	31	1079	\N	0.00	active	275	1064	Cartridge Fuse 10A	\N	584.25	467.40	\N	packet	f	97
376	PVC Conduit 32mm	SKU-1097	\N	393.00	589.50	21	1080	\N	0.00	active	276	1069	PVC Conduit 32mm	PVC Conduit 32mm (اردو)	589.50	471.60	\N	meter	f	98
377	Weatherproof Box	SKU-1098	\N	396.50	594.75	19	\N	\N	0.00	active	277	1072	Weatherproof Box	\N	594.75	475.80	\N	box	t	99
380	Pliers Long Nose	SKU-1101	\N	407.00	610.50	26	\N	\N	0.00	active	280	1087	Pliers Long Nose	Pliers Long Nose (اردو)	610.50	488.40	\N	piece	t	102
382	Digital Multimeter	SKU-1103	\N	414.00	621.00	9	1086	\N	0.00	active	282	1094	Digital Multimeter	Digital Multimeter (اردو)	621.00	496.80	\N	meter	f	104
386	Battery 12V 7Ah	SKU-1107	\N	428.00	642.00	5	\N	\N	0.00	active	286	1106	Battery 12V 7Ah	Battery 12V 7Ah (اردو)	642.00	513.60	\N	piece	t	108
388	PVC Pipe 1"	SKU-1109	\N	435.00	652.50	13	1	\N	0.00	active	288	1112	PVC Pipe 1"	PVC Pipe 1" (اردو)	652.50	522.00	565.50	meter	f	110
389	PVC Pipe 1.5"	SKU-1110	\N	438.50	657.75	19	\N	\N	0.00	active	289	1115	PVC Pipe 1.5"	\N	657.75	526.20	\N	box	t	111
393	Gate Valve 1"	SKU-1114	\N	452.50	678.75	10	987	\N	0.00	active	293	\N	Gate Valve 1"	\N	678.75	543.00	588.25	packet	f	115
398	Solar Water Heater	SKU-1119	\N	470.00	705.00	17	\N	\N	0.00	active	298	1140	Solar Water Heater	Solar Water Heater (اردو)	705.00	564.00	611.00	piece	t	120
399	Toilet Set Premium	SKU-1120	\N	473.50	710.25	9	993	\N	0.00	active	299	1143	Toilet Set Premium	\N	710.25	568.20	\N	packet	f	121
400	Basin Wall Mount	SKU-1121	\N	477.00	715.50	2	994	\N	0.00	active	300	1147	Basin Wall Mount	Basin Wall Mount (اردو)	715.50	572.40	\N	meter	f	122
401	Faucet Mixer	SKU-1122	\N	480.50	720.75	10	\N	\N	0.00	active	301	1150	Faucet Mixer	\N	720.75	576.60	\N	box	t	123
402	Porcelain Tile	SKU-1123	\N	484.00	726.00	7	996	\N	0.00	active	1	1	Porcelain Tile	Porcelain Tile (اردو)	726.00	580.80	\N	kg	f	124
405	Steel Angle	SKU-1126	\N	494.50	741.75	6	999	\N	0.00	active	274	1054	Steel Angle	\N	741.75	593.40	\N	packet	f	127
407	Door Hinge Heavy	SKU-1128	\N	501.50	752.25	8	\N	\N	0.00	active	276	1068	Door Hinge Heavy	\N	752.25	601.80	\N	box	t	129
411	Nails 3"	SKU-1132	\N	515.50	773.25	24	1005	\N	0.00	active	280	1086	Nails 3"	\N	773.25	618.60	\N	packet	f	133
279	Copper Wire 1.5mm	SKU-1000	\N	53.50	80.25	0	983	\N	0.00	active	272	1040	Copper Wire 1.5mm	\N	80.25	64.20	\N	packet	f	1
373	MCB 63A	SKU-1094	\N	382.50	573.75	0	1077	\N	0.00	active	273	1047	MCB 63A	\N	573.75	459.00	497.25	roll	f	95
378	Junction Box 4 Way	SKU-1099	\N	400.00	600.00	0	1082	\N	0.00	active	278	1076	Junction Box 4 Way	Junction Box 4 Way (اردو)	600.00	480.00	520.00	kg	f	100
379	Screwdriver Phillips	SKU-1100	\N	403.50	605.25	0	1083	\N	0.00	active	279	1082	Screwdriver Phillips	\N	605.25	484.20	\N	roll	f	101
381	Wire Stripper Auto	SKU-1102	\N	410.50	615.75	0	1085	\N	0.00	active	281	1092	Wire Stripper Auto	\N	615.75	492.60	\N	packet	f	103
383	Drill Machine Heavy	SKU-1104	\N	417.50	626.25	0	\N	\N	0.00	active	283	\N	Drill Machine Heavy	\N	626.25	501.00	542.75	box	t	105
384	Safety Gloves Leather	SKU-1105	\N	421.00	631.50	0	1088	\N	0.00	active	284	\N	Safety Gloves Leather	Safety Gloves Leather (اردو)	631.50	505.20	\N	kg	f	106
385	Fire Extinguisher	SKU-1106	\N	424.50	636.75	0	1089	\N	0.00	active	285	1099	Fire Extinguisher	\N	636.75	509.40	\N	roll	f	107
387	Battery 12V 100Ah	SKU-1108	\N	431.50	647.25	0	1091	\N	0.00	active	287	1108	Battery 12V 100Ah	\N	647.25	517.80	\N	packet	f	109
390	GI Pipe 1.5"	SKU-1111	\N	442.00	663.00	0	984	\N	0.00	active	290	1118	GI Pipe 1.5"	GI Pipe 1.5" (اردو)	663.00	530.40	\N	kg	f	112
391	CPVC Pipe 3/4"	SKU-1112	\N	445.50	668.25	0	985	\N	0.00	active	291	1123	CPVC Pipe 3/4"	\N	668.25	534.60	\N	roll	f	113
392	Ball Valve 3/4"	SKU-1113	\N	449.00	673.50	0	\N	\N	0.00	active	292	1126	Ball Valve 3/4"	Ball Valve 3/4" (اردو)	673.50	538.80	\N	piece	t	114
394	Butterfly Valve	SKU-1115	\N	456.00	684.00	0	988	\N	0.00	active	294	\N	Butterfly Valve	Butterfly Valve (اردو)	684.00	547.20	\N	meter	f	116
395	Centrifugal Pump 2HP	SKU-1116	\N	459.50	689.25	0	\N	\N	0.00	active	295	1128	Centrifugal Pump 2HP	\N	689.25	551.40	\N	box	t	117
396	Submersible Pump 1HP	SKU-1117	\N	463.00	694.50	0	990	\N	0.00	active	296	1133	Submersible Pump 1HP	Submersible Pump 1HP (اردو)	694.50	555.60	\N	kg	f	118
397	Electric Water Heater 80L	SKU-1118	\N	466.50	699.75	0	991	\N	0.00	active	297	1137	Electric Water Heater 80L	\N	699.75	559.80	\N	roll	f	119
403	White Cement	SKU-1124	\N	487.50	731.25	0	997	\N	0.00	active	272	1037	White Cement	\N	731.25	585.00	633.75	roll	f	125
404	Steel Bar 16mm	SKU-1125	\N	491.00	736.50	0	\N	\N	0.00	active	273	1051	Steel Bar 16mm	Steel Bar 16mm (اردو)	736.50	589.20	\N	piece	t	126
406	Cylinder Lock	SKU-1127	\N	498.00	747.00	0	1000	\N	0.00	active	275	1066	Cylinder Lock	Cylinder Lock (اردو)	747.00	597.60	\N	meter	f	128
408	Window Handle	SKU-1129	\N	505.00	757.50	0	1002	\N	0.00	active	277	1074	Window Handle	Window Handle (اردو)	757.50	606.00	656.50	kg	f	130
409	Wood Screw 3"	SKU-1130	\N	508.50	762.75	0	1003	\N	0.00	active	278	1076	Wood Screw 3"	\N	762.75	610.20	\N	roll	f	131
410	Anchor Bolt	SKU-1131	\N	512.00	768.00	0	\N	\N	0.00	active	279	1082	Anchor Bolt	Anchor Bolt (اردو)	768.00	614.40	\N	piece	t	132
412	Tile Adhesive	SKU-1133	\N	519.00	778.50	0	1006	\N	0.00	active	281	1090	Tile Adhesive	Tile Adhesive (اردو)	778.50	622.80	\N	meter	f	134
413	Acrylic Sealant	SKU-1134	\N	522.50	783.75	0	\N	\N	0.00	active	282	1094	Acrylic Sealant	\N	783.75	627.00	679.25	box	t	135
414	Cable Tie 100mm	SKU-1135	\N	526.00	789.00	0	1008	\N	0.00	active	283	\N	Cable Tie 100mm	Cable Tie 100mm (اردو)	789.00	631.20	\N	kg	f	136
415	Wire Nut Large	SKU-1136	\N	529.50	794.25	0	1009	\N	0.00	active	284	\N	Wire Nut Large	\N	794.25	635.40	\N	roll	f	137
416	Cable Clip Metal	SKU-1137	\N	533.00	799.50	0	\N	\N	0.00	active	285	1101	Cable Clip Metal	Cable Clip Metal (اردو)	799.50	639.60	\N	piece	t	138
\.


--
-- Data for Name: purchase_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchase_items (purchase_item_id, purchase_id, item_id, quantity, cost_price, subtotal) FROM stdin;
201	101	280	11	57.00	627.00
202	101	341	6	270.50	1623.00
203	101	303	6	137.50	825.00
204	102	281	12	60.50	726.00
205	103	282	13	64.00	832.00
206	103	345	8	284.50	2276.00
207	104	283	14	67.50	945.00
208	104	347	9	291.50	2623.50
209	104	312	9	169.00	1521.00
210	105	1	15	500.00	7500.00
211	106	284	16	71.00	1136.00
212	106	351	11	305.50	3360.50
213	107	285	17	74.50	1266.50
214	107	353	12	312.50	3750.00
215	107	321	12	200.50	2406.00
216	108	286	18	78.00	1404.00
217	109	287	19	81.50	1548.50
218	109	357	14	326.50	4571.00
219	110	288	20	85.00	1700.00
220	110	359	15	333.50	5002.50
221	110	330	15	232.00	3480.00
222	111	289	21	88.50	1858.50
223	112	290	22	92.00	2024.00
224	112	363	17	347.50	5907.50
225	113	291	23	95.50	2196.50
226	113	365	18	354.50	6381.00
227	113	339	18	263.50	4743.00
228	114	292	24	99.00	2376.00
229	115	293	25	102.50	2562.50
230	115	369	20	368.50	7370.00
231	116	294	26	106.00	2756.00
232	116	371	21	375.50	7885.50
233	116	348	21	295.00	6195.00
234	117	295	27	109.50	2956.50
235	118	296	28	113.00	3164.00
236	118	375	23	389.50	8958.50
237	119	297	29	116.50	3378.50
238	119	377	24	396.50	9516.00
239	119	357	24	326.50	7836.00
240	120	298	30	120.00	3600.00
241	121	299	31	123.50	3828.50
242	121	381	6	410.50	2463.00
243	122	300	32	127.00	4064.00
244	122	383	7	417.50	2922.50
245	122	366	7	358.00	2506.00
246	123	301	33	130.50	4306.50
247	124	302	34	134.00	4556.00
248	124	387	9	431.50	3883.50
249	125	303	35	137.50	4812.50
250	125	389	10	438.50	4385.00
251	125	375	10	389.50	3895.00
252	126	304	36	141.00	5076.00
253	127	305	37	144.50	5346.50
254	127	393	12	452.50	5430.00
255	128	306	38	148.00	5624.00
256	128	395	13	459.50	5973.50
257	128	384	13	421.00	5473.00
258	129	307	39	151.50	5908.50
259	130	308	40	155.00	6200.00
260	130	399	15	473.50	7102.50
261	131	309	41	158.50	6498.50
262	131	401	16	480.50	7688.00
263	131	393	16	452.50	7240.00
264	132	310	42	162.00	6804.00
265	133	311	43	165.50	7116.50
266	133	405	18	494.50	8901.00
267	134	312	44	169.00	7436.00
268	134	407	19	501.50	9528.50
269	134	402	19	484.00	9196.00
270	135	313	45	172.50	7762.50
271	136	314	46	176.00	8096.00
272	136	411	21	515.50	10825.50
273	137	315	47	179.50	8436.50
274	137	413	22	522.50	11495.00
275	137	411	22	515.50	11341.00
276	138	316	48	183.00	8784.00
277	139	317	49	186.50	9138.50
278	139	279	24	53.50	1284.00
279	140	318	50	190.00	9500.00
280	140	281	5	60.50	302.50
281	140	282	5	64.00	320.00
282	141	319	51	193.50	9868.50
283	142	320	52	197.00	10244.00
284	142	284	7	71.00	497.00
285	143	321	53	200.50	10626.50
286	143	286	8	78.00	624.00
287	143	290	8	92.00	736.00
288	144	322	54	204.00	11016.00
289	145	323	55	207.50	11412.50
290	145	290	10	92.00	920.00
291	146	324	56	211.00	11816.00
292	146	292	11	99.00	1089.00
293	146	299	11	123.50	1358.50
294	147	325	57	214.50	12226.50
295	148	326	58	218.00	12644.00
296	148	296	13	113.00	1469.00
297	149	327	59	221.50	13068.50
298	149	298	14	120.00	1680.00
299	149	308	14	155.00	2170.00
300	150	328	60	225.00	13500.00
301	151	329	61	228.50	13938.50
302	151	302	16	134.00	2144.00
303	152	330	62	232.00	14384.00
304	152	304	17	141.00	2397.00
305	152	317	17	186.50	3170.50
306	153	331	63	235.50	14836.50
307	154	332	64	239.00	15296.00
308	154	308	19	155.00	2945.00
309	155	333	65	242.50	15762.50
310	155	310	20	162.00	3240.00
311	155	326	20	218.00	4360.00
312	156	334	66	246.00	16236.00
313	157	335	67	249.50	16716.50
314	157	314	22	176.00	3872.00
315	158	336	68	253.00	17204.00
316	158	316	23	183.00	4209.00
317	158	335	23	249.50	5738.50
318	159	337	69	256.50	17698.50
319	160	338	70	260.00	18200.00
320	160	320	5	197.00	985.00
321	161	339	71	263.50	18708.50
322	161	322	6	204.00	1224.00
323	161	344	6	281.00	1686.00
324	162	340	72	267.00	19224.00
325	163	341	73	270.50	19746.50
326	163	326	8	218.00	1744.00
327	164	342	74	274.00	20276.00
328	164	328	9	225.00	2025.00
329	164	353	9	312.50	2812.50
330	165	343	75	277.50	20812.50
331	166	344	76	281.00	21356.00
332	166	332	11	239.00	2629.00
333	167	345	77	284.50	21906.50
334	167	334	12	246.00	2952.00
335	167	362	12	344.00	4128.00
336	168	346	78	288.00	22464.00
337	169	347	79	291.50	23028.50
338	169	338	14	260.00	3640.00
339	170	348	80	295.00	23600.00
340	170	340	15	267.00	4005.00
341	170	371	15	375.50	5632.50
342	171	349	81	298.50	24178.50
343	172	350	82	302.00	24764.00
344	172	344	17	281.00	4777.00
345	173	351	83	305.50	25356.50
346	173	346	18	288.00	5184.00
347	173	380	18	407.00	7326.00
348	174	352	84	309.00	25956.00
349	175	353	85	312.50	26562.50
350	175	350	20	302.00	6040.00
351	176	354	86	316.00	27176.00
352	176	352	21	309.00	6489.00
353	176	389	21	438.50	9208.50
354	177	355	87	319.50	27796.50
355	178	356	88	323.00	28424.00
356	178	356	23	323.00	7429.00
357	179	357	89	326.50	29058.50
358	179	358	24	330.00	7920.00
359	179	398	24	470.00	11280.00
360	180	358	90	330.00	29700.00
361	181	359	91	333.50	30348.50
362	181	362	6	344.00	2064.00
363	182	360	92	337.00	31004.00
364	182	364	7	351.00	2457.00
365	182	407	7	501.50	3510.50
366	183	361	93	340.50	31666.50
367	184	362	94	344.00	32336.00
368	184	368	9	365.00	3285.00
369	185	363	95	347.50	33012.50
370	185	370	10	372.00	3720.00
371	185	416	10	533.00	5330.00
372	186	364	96	351.00	33696.00
373	187	365	97	354.50	34386.50
374	187	374	12	386.00	4632.00
375	188	366	98	358.00	35084.00
376	188	376	13	393.00	5109.00
377	188	286	13	78.00	1014.00
378	189	367	99	361.50	35788.50
379	190	368	100	365.00	36500.00
380	190	380	15	407.00	6105.00
381	191	369	10	368.50	3685.00
382	191	382	16	414.00	6624.00
383	191	295	16	109.50	1752.00
384	192	370	11	372.00	4092.00
385	193	371	12	375.50	4506.00
386	193	386	18	428.00	7704.00
387	194	372	13	379.00	4927.00
388	194	388	19	435.00	8265.00
389	194	304	19	141.00	2679.00
390	195	373	14	382.50	5355.00
391	196	374	15	386.00	5790.00
392	196	392	21	449.00	9429.00
393	197	375	16	389.50	6232.00
394	197	394	22	456.00	10032.00
395	197	313	22	172.50	3795.00
396	198	376	17	393.00	6681.00
397	199	377	18	396.50	7137.00
398	199	398	24	470.00	11280.00
399	200	378	19	400.00	7600.00
400	200	400	5	477.00	2385.00
401	200	322	5	204.00	1020.00
402	204	417	20	50.00	1000.00
403	204	281	100	60.50	6050.00
404	205	284	100	71.00	7100.00
405	205	293	50	102.50	5125.00
\.


--
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchases (purchase_id, product_id, supplier_id, date, quantity, purchase_price, total_amount, payment_type, created_at) FROM stdin;
204	\N	1061	2026-01-19 05:00:00	1	\N	7050.00	cash	2026-01-20 02:59:55.390029
205	\N	1061	2026-01-19 05:00:00	1	\N	12225.00	credit	2026-01-20 03:02:09.540165
101	280	983	2025-11-10 04:51:47.555504	11	57.00	3075.00	cash	2026-01-19 14:33:01.012952
102	281	984	2025-09-03 14:46:26.128599	12	60.50	726.00	cash	2026-01-19 14:33:01.012952
103	282	985	2025-08-05 07:22:30.440754	13	64.00	3108.00	cash	2026-01-19 14:33:01.012952
104	283	986	2025-09-21 20:52:05.337691	14	67.50	5089.50	cash	2026-01-19 14:33:01.012952
105	1	987	2025-08-21 20:27:32.495991	15	500.00	7500.00	cash	2026-01-19 14:33:01.012952
106	284	988	2025-08-26 19:20:03.049292	16	71.00	4496.50	cash	2026-01-19 14:33:01.012952
107	285	989	2025-12-19 22:25:14.713974	17	74.50	7422.50	credit	2026-01-19 14:33:01.012952
108	286	990	2025-10-25 21:29:14.308372	18	78.00	1404.00	credit	2026-01-19 14:33:01.012952
109	287	991	2026-01-07 09:02:00.597881	19	81.50	6119.50	credit	2026-01-19 14:33:01.012952
110	288	992	2025-08-01 04:59:14.882398	20	85.00	10182.50	cash	2026-01-19 14:33:01.012952
111	289	993	2025-09-23 19:27:36.768254	21	88.50	1858.50	cash	2026-01-19 14:33:01.012952
112	290	994	2025-11-12 12:58:34.494345	22	92.00	7931.50	cash	2026-01-19 14:33:01.012952
113	291	995	2025-11-06 16:34:06.919018	23	95.50	13320.50	cash	2026-01-19 14:33:01.012952
114	292	996	2025-08-03 07:38:59.55345	24	99.00	2376.00	cash	2026-01-19 14:33:01.012952
115	293	997	2025-11-18 03:08:51.263374	25	102.50	9932.50	cash	2026-01-19 14:33:01.012952
116	294	998	2025-10-24 10:44:52.450862	26	106.00	16836.50	cash	2026-01-19 14:33:01.012952
117	295	999	2025-12-17 14:37:56.30211	27	109.50	2956.50	credit	2026-01-19 14:33:01.012952
118	296	1000	2026-01-10 09:56:53.704024	28	113.00	12122.50	credit	2026-01-19 14:33:01.012952
119	297	1001	2025-09-13 05:44:38.654975	29	116.50	20730.50	credit	2026-01-19 14:33:01.012952
120	298	1002	2025-11-16 12:43:06.95236	30	120.00	3600.00	cash	2026-01-19 14:33:01.012952
121	299	1003	2025-12-08 09:19:47.651993	31	123.50	6291.50	cash	2026-01-19 14:33:01.012952
122	300	1004	2025-10-08 14:11:32.417233	32	127.00	9492.50	cash	2026-01-19 14:33:01.012952
123	301	1005	2025-10-17 01:23:22.816949	33	130.50	4306.50	cash	2026-01-19 14:33:01.012952
124	302	1006	2025-10-09 22:33:41.289104	34	134.00	8439.50	cash	2026-01-19 14:33:01.012952
125	303	1007	2026-01-09 12:28:43.810782	35	137.50	13092.50	cash	2026-01-19 14:33:01.012952
126	304	1008	2025-12-12 19:09:15.574586	36	141.00	5076.00	cash	2026-01-19 14:33:01.012952
127	305	1009	2025-12-04 13:16:41.468915	37	144.50	10776.50	credit	2026-01-19 14:33:01.012952
128	306	1010	2025-09-10 11:55:07.721791	38	148.00	17070.50	credit	2026-01-19 14:33:01.012952
129	307	1011	2025-11-25 05:25:41.198754	39	151.50	5908.50	credit	2026-01-19 14:33:01.012952
130	308	1012	2025-09-23 09:30:59.952808	40	155.00	13302.50	cash	2026-01-19 14:33:01.012952
131	309	1013	2025-12-24 04:07:06.716927	41	158.50	21426.50	cash	2026-01-19 14:33:01.012952
132	310	1014	2025-11-30 01:14:22.307026	42	162.00	6804.00	cash	2026-01-19 14:33:01.012952
133	311	1015	2026-01-09 18:03:43.47621	43	165.50	16017.50	cash	2026-01-19 14:33:01.012952
134	312	1016	2025-12-25 11:19:28.859055	44	169.00	26160.50	cash	2026-01-19 14:33:01.012952
135	313	1017	2025-12-25 12:25:15.267197	45	172.50	7762.50	cash	2026-01-19 14:33:01.012952
136	314	1018	2025-09-20 13:32:16.513956	46	176.00	18921.50	cash	2026-01-19 14:33:01.012952
137	315	1019	2025-11-08 02:28:55.974255	47	179.50	31272.50	credit	2026-01-19 14:33:01.012952
138	316	1020	2025-09-18 10:29:20.772949	48	183.00	8784.00	credit	2026-01-19 14:33:01.012952
139	317	1021	2025-08-20 07:50:12.846809	49	186.50	10422.50	credit	2026-01-19 14:33:01.012952
140	318	1022	2025-08-22 12:43:19.661139	50	190.00	10122.50	cash	2026-01-19 14:33:01.012952
141	319	1023	2025-10-12 12:55:02.673127	51	193.50	9868.50	cash	2026-01-19 14:33:01.012952
142	320	1024	2025-08-17 08:36:42.921452	52	197.00	10741.00	cash	2026-01-19 14:33:01.012952
143	321	1025	2025-09-25 21:49:08.67546	53	200.50	11986.50	cash	2026-01-19 14:33:01.012952
144	322	1026	2025-11-27 03:32:48.640207	54	204.00	11016.00	cash	2026-01-19 14:33:01.012952
145	323	1027	2025-11-10 21:55:13.793285	55	207.50	12332.50	cash	2026-01-19 14:33:01.012952
146	324	1028	2025-10-07 11:05:02.315311	56	211.00	14263.50	cash	2026-01-19 14:33:01.012952
147	325	1029	2025-10-29 17:57:59.92962	57	214.50	12226.50	credit	2026-01-19 14:33:01.012952
148	326	1030	2025-09-27 08:55:05.29938	58	218.00	14113.00	credit	2026-01-19 14:33:01.012952
149	327	1031	2025-09-05 11:43:16.074054	59	221.50	16918.50	credit	2026-01-19 14:33:01.012952
150	328	1032	2025-08-01 09:06:24.831964	60	225.00	13500.00	cash	2026-01-19 14:33:01.012952
151	329	1033	2025-11-05 06:38:47.0154	61	228.50	16082.50	cash	2026-01-19 14:33:01.012952
152	330	1034	2025-11-20 09:58:16.124334	62	232.00	19951.50	cash	2026-01-19 14:33:01.012952
153	331	1035	2025-08-24 10:29:18.367968	63	235.50	14836.50	cash	2026-01-19 14:33:01.012952
154	332	1036	2025-10-28 10:19:00.114107	64	239.00	18241.00	cash	2026-01-19 14:33:01.012952
155	333	1037	2025-09-18 18:18:28.756387	65	242.50	23362.50	cash	2026-01-19 14:33:01.012952
156	334	1038	2025-10-16 14:24:45.680116	66	246.00	16236.00	cash	2026-01-19 14:33:01.012952
157	335	1039	2025-11-23 12:51:05.691722	67	249.50	20588.50	credit	2026-01-19 14:33:01.012952
158	336	1040	2025-11-14 21:19:13.341336	68	253.00	27151.50	credit	2026-01-19 14:33:01.012952
159	337	1041	2025-09-07 09:25:27.773769	69	256.50	17698.50	credit	2026-01-19 14:33:01.012952
160	338	1042	2026-01-10 00:46:42.041086	70	260.00	19185.00	cash	2026-01-19 14:33:01.012952
161	339	1043	2025-09-20 09:39:25.456999	71	263.50	21618.50	cash	2026-01-19 14:33:01.012952
162	340	1044	2025-12-27 16:17:39.463486	72	267.00	19224.00	cash	2026-01-19 14:33:01.012952
163	341	1045	2026-01-17 11:50:31.461215	73	270.50	21490.50	cash	2026-01-19 14:33:01.012952
164	342	1046	2025-10-04 01:25:46.556655	74	274.00	25113.50	cash	2026-01-19 14:33:01.012952
165	343	1047	2025-08-10 01:03:09.551802	75	277.50	20812.50	cash	2026-01-19 14:33:01.012952
166	344	1048	2025-11-15 04:12:10.127393	76	281.00	23985.00	cash	2026-01-19 14:33:01.012952
167	345	1049	2025-09-29 05:31:15.491402	77	284.50	28986.50	credit	2026-01-19 14:33:01.012952
168	346	1050	2025-10-04 12:42:13.897484	78	288.00	22464.00	credit	2026-01-19 14:33:01.012952
169	347	1051	2025-09-05 06:28:46.396442	79	291.50	26668.50	credit	2026-01-19 14:33:01.012952
170	348	1052	2025-12-06 21:44:50.96968	80	295.00	33237.50	cash	2026-01-19 14:33:01.012952
171	349	1053	2025-11-12 06:54:07.422842	81	298.50	24178.50	cash	2026-01-19 14:33:01.012952
172	350	1054	2025-11-16 02:27:38.448448	82	302.00	29541.00	cash	2026-01-19 14:33:01.012952
173	351	1055	2025-09-22 22:12:28.968717	83	305.50	37866.50	cash	2026-01-19 14:33:01.012952
174	352	1056	2025-10-17 14:05:29.868564	84	309.00	25956.00	cash	2026-01-19 14:33:01.012952
175	353	1057	2025-07-29 11:35:10.747099	85	312.50	32602.50	cash	2026-01-19 14:33:01.012952
176	354	1058	2025-09-07 10:54:54.966845	86	316.00	42873.50	cash	2026-01-19 14:33:01.012952
177	355	1059	2025-09-29 06:58:31.168247	87	319.50	27796.50	credit	2026-01-19 14:33:01.012952
178	356	1060	2026-01-02 04:48:01.317064	88	323.00	35853.00	credit	2026-01-19 14:33:01.012952
179	357	1061	2025-07-26 03:24:41.710668	89	326.50	48258.50	credit	2026-01-19 14:33:01.012952
180	358	1062	2025-12-12 14:53:59.767501	90	330.00	29700.00	cash	2026-01-19 14:33:01.012952
181	359	1063	2026-01-08 07:48:57.652609	91	333.50	32412.50	cash	2026-01-19 14:33:01.012952
182	360	1064	2025-12-28 16:54:14.914969	92	337.00	36971.50	cash	2026-01-19 14:33:01.012952
183	361	1065	2025-12-09 13:38:31.850286	93	340.50	31666.50	cash	2026-01-19 14:33:01.012952
184	362	1066	2025-11-12 21:14:56.40097	94	344.00	35621.00	cash	2026-01-19 14:33:01.012952
185	363	1067	2025-11-30 07:29:52.963986	95	347.50	42062.50	cash	2026-01-19 14:33:01.012952
186	364	1068	2025-12-22 21:45:05.116225	96	351.00	33696.00	cash	2026-01-19 14:33:01.012952
187	365	1069	2026-01-10 08:22:46.792494	97	354.50	39018.50	credit	2026-01-19 14:33:01.012952
188	366	1070	2025-07-31 16:12:34.601379	98	358.00	41207.00	credit	2026-01-19 14:33:01.012952
189	367	1071	2025-08-31 11:27:38.995199	99	361.50	35788.50	credit	2026-01-19 14:33:01.012952
190	368	1072	2025-08-25 02:55:19.9024	100	365.00	42605.00	cash	2026-01-19 14:33:01.012952
191	369	1073	2025-11-08 03:24:45.785433	10	368.50	12061.00	cash	2026-01-19 14:33:01.012952
192	370	1074	2025-09-28 21:47:12.618275	11	372.00	4092.00	cash	2026-01-19 14:33:01.012952
193	371	1075	2025-09-20 20:33:15.65906	12	375.50	12210.00	cash	2026-01-19 14:33:01.012952
194	372	1076	2025-12-01 06:43:17.608997	13	379.00	15871.00	cash	2026-01-19 14:33:01.012952
195	373	1077	2025-09-30 00:38:41.990475	14	382.50	5355.00	cash	2026-01-19 14:33:01.012952
196	374	1078	2025-12-21 13:40:59.358508	15	386.00	15219.00	cash	2026-01-19 14:33:01.012952
197	375	1079	2025-12-22 07:37:09.343388	16	389.50	20059.00	credit	2026-01-19 14:33:01.012952
198	376	1080	2025-08-03 08:25:45.64692	17	393.00	6681.00	credit	2026-01-19 14:33:01.012952
199	377	1081	2025-11-01 09:27:16.502983	18	396.50	18417.00	credit	2026-01-19 14:33:01.012952
200	378	1082	2025-08-26 08:02:40.946075	19	400.00	11005.00	cash	2026-01-19 14:33:01.012952
\.


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_items (sale_item_id, sale_id, product_id, quantity, selling_price, purchase_price, profit) FROM stdin;
1	1	1	1	600.00	500.00	100.00
304	102	380	3	610.50	407.00	610.50
305	102	343	3	416.25	277.50	416.25
306	102	306	3	222.00	148.00	222.00
307	1	280	2	85.50	57.00	57.00
308	1	281	2	90.75	60.50	60.50
309	103	381	4	615.75	410.50	821.00
310	103	345	4	426.75	284.50	569.00
311	103	309	4	237.75	158.50	317.00
312	103	412	4	778.50	519.00	1038.00
313	104	382	5	621.00	414.00	1035.00
314	104	347	5	437.25	291.50	728.75
315	104	312	5	253.50	169.00	422.50
316	104	416	5	799.50	533.00	1332.50
317	104	381	5	615.75	410.50	1026.25
318	105	383	6	626.25	417.50	1252.50
319	106	384	7	631.50	421.00	1473.50
320	106	351	7	458.25	305.50	1069.25
321	107	385	8	636.75	424.50	1698.00
322	107	353	8	468.75	312.50	1250.00
323	107	321	8	300.75	200.50	802.00
324	108	386	9	642.00	428.00	1926.00
325	108	355	9	479.25	319.50	1437.75
326	108	324	9	316.50	211.00	949.50
327	108	293	9	153.75	102.50	461.25
328	109	387	10	647.25	431.50	2157.50
329	109	357	10	489.75	326.50	1632.50
330	109	327	10	332.25	221.50	1107.50
331	109	297	10	174.75	116.50	582.50
332	109	406	10	747.00	498.00	2490.00
333	110	388	1	652.50	435.00	217.50
334	111	389	2	657.75	438.50	438.50
335	111	361	2	510.75	340.50	340.50
336	112	390	3	663.00	442.00	663.00
337	112	363	3	521.25	347.50	521.25
338	112	336	3	379.50	253.00	379.50
339	113	391	4	668.25	445.50	891.00
340	113	365	4	531.75	354.50	709.00
341	113	339	4	395.25	263.50	527.00
342	113	313	4	258.75	172.50	345.00
343	114	392	5	673.50	449.00	1122.50
344	114	367	5	542.25	361.50	903.75
345	114	342	5	411.00	274.00	685.00
346	114	317	5	279.75	186.50	466.25
347	114	292	5	148.50	99.00	247.50
348	115	393	6	678.75	452.50	1357.50
349	116	394	7	684.00	456.00	1596.00
350	116	371	7	563.25	375.50	1314.25
351	117	395	8	689.25	459.50	1838.00
352	117	373	8	573.75	382.50	1530.00
353	117	351	8	458.25	305.50	1222.00
354	118	396	9	694.50	463.00	2083.50
355	118	375	9	584.25	389.50	1752.75
356	118	354	9	474.00	316.00	1422.00
357	118	333	9	363.75	242.50	1091.25
358	119	397	10	699.75	466.50	2332.50
359	119	377	10	594.75	396.50	1982.50
360	119	357	10	489.75	326.50	1632.50
361	119	337	10	384.75	256.50	1282.50
362	119	317	10	279.75	186.50	932.50
363	120	398	1	705.00	470.00	235.00
364	121	399	2	710.25	473.50	473.50
365	121	381	2	615.75	410.50	410.50
366	122	400	3	715.50	477.00	715.50
367	122	383	3	626.25	417.50	626.25
368	122	366	3	537.00	358.00	537.00
369	123	401	4	720.75	480.50	961.00
370	123	385	4	636.75	424.50	849.00
371	123	369	4	552.75	368.50	737.00
372	123	353	4	468.75	312.50	625.00
373	124	402	5	726.00	484.00	1210.00
374	124	387	5	647.25	431.50	1078.75
375	124	372	5	568.50	379.00	947.50
376	124	357	5	489.75	326.50	816.25
377	124	342	5	411.00	274.00	685.00
378	125	403	6	731.25	487.50	1462.50
379	126	404	7	736.50	491.00	1718.50
380	126	391	7	668.25	445.50	1559.25
381	127	405	8	741.75	494.50	1978.00
382	127	393	8	678.75	452.50	1810.00
383	127	381	8	615.75	410.50	1642.00
384	128	406	9	747.00	498.00	2241.00
385	128	395	9	689.25	459.50	2067.75
386	128	384	9	631.50	421.00	1894.50
387	128	373	9	573.75	382.50	1721.25
388	129	407	10	752.25	501.50	2507.50
389	129	397	10	699.75	466.50	2332.50
390	129	387	10	647.25	431.50	2157.50
391	129	377	10	594.75	396.50	1982.50
392	129	367	10	542.25	361.50	1807.50
393	130	408	1	757.50	505.00	252.50
394	131	409	2	762.75	508.50	508.50
395	131	401	2	720.75	480.50	480.50
396	132	410	3	768.00	512.00	768.00
397	132	403	3	731.25	487.50	731.25
398	132	396	3	694.50	463.00	694.50
399	133	411	4	773.25	515.50	1031.00
400	133	405	4	741.75	494.50	989.00
401	133	399	4	710.25	473.50	947.00
402	133	393	4	678.75	452.50	905.00
403	134	412	5	778.50	519.00	1297.50
404	134	407	5	752.25	501.50	1253.75
405	134	402	5	726.00	484.00	1210.00
406	134	397	5	699.75	466.50	1166.25
407	134	392	5	673.50	449.00	1122.50
408	135	413	6	783.75	522.50	1567.50
409	136	414	7	789.00	526.00	1841.00
410	136	411	7	773.25	515.50	1804.25
411	137	415	8	794.25	529.50	2118.00
412	137	413	8	783.75	522.50	2090.00
413	137	411	8	773.25	515.50	2062.00
414	138	416	9	799.50	533.00	2398.50
415	138	415	9	794.25	529.50	2382.75
416	138	414	9	789.00	526.00	2367.00
417	138	413	9	783.75	522.50	2351.25
418	139	279	10	80.25	53.50	267.50
419	139	279	10	80.25	53.50	267.50
420	139	279	10	80.25	53.50	267.50
421	139	279	10	80.25	53.50	267.50
422	139	279	10	80.25	53.50	267.50
423	140	280	1	85.50	57.00	28.50
424	141	281	2	90.75	60.50	60.50
425	141	283	2	101.25	67.50	67.50
426	142	282	3	96.00	64.00	96.00
427	142	284	3	106.50	71.00	106.50
428	142	287	3	122.25	81.50	122.25
429	143	283	4	101.25	67.50	135.00
430	143	286	4	117.00	78.00	156.00
431	143	290	4	138.00	92.00	184.00
432	143	294	4	159.00	106.00	212.00
433	144	1	5	600.00	500.00	500.00
434	144	288	5	127.50	85.00	212.50
435	144	293	5	153.75	102.50	256.25
436	144	298	5	180.00	120.00	300.00
437	144	303	5	206.25	137.50	343.75
438	145	284	6	106.50	71.00	213.00
439	146	285	7	111.75	74.50	260.75
440	146	292	7	148.50	99.00	346.50
441	147	286	8	117.00	78.00	312.00
442	147	294	8	159.00	106.00	424.00
443	147	302	8	201.00	134.00	536.00
444	148	287	9	122.25	81.50	366.75
445	148	296	9	169.50	113.00	508.50
446	148	305	9	216.75	144.50	650.25
447	148	314	9	264.00	176.00	792.00
448	149	288	10	127.50	85.00	425.00
449	149	298	10	180.00	120.00	600.00
450	149	308	10	232.50	155.00	775.00
451	149	318	10	285.00	190.00	950.00
452	149	328	10	337.50	225.00	1125.00
453	150	289	1	132.75	88.50	44.25
454	151	290	2	138.00	92.00	92.00
455	151	302	2	201.00	134.00	134.00
456	152	291	3	143.25	95.50	143.25
457	152	304	3	211.50	141.00	211.50
458	152	317	3	279.75	186.50	279.75
459	153	292	4	148.50	99.00	198.00
460	153	306	4	222.00	148.00	296.00
461	153	320	4	295.50	197.00	394.00
462	153	334	4	369.00	246.00	492.00
463	154	293	5	153.75	102.50	256.25
464	154	308	5	232.50	155.00	387.50
465	154	323	5	311.25	207.50	518.75
466	154	338	5	390.00	260.00	650.00
467	154	353	5	468.75	312.50	781.25
468	155	294	6	159.00	106.00	318.00
469	156	295	7	164.25	109.50	383.25
470	156	312	7	253.50	169.00	591.50
471	157	296	8	169.50	113.00	452.00
472	157	314	8	264.00	176.00	704.00
473	157	332	8	358.50	239.00	956.00
474	158	297	9	174.75	116.50	524.25
475	158	316	9	274.50	183.00	823.50
476	158	335	9	374.25	249.50	1122.75
477	158	354	9	474.00	316.00	1422.00
478	159	298	10	180.00	120.00	600.00
479	159	318	10	285.00	190.00	950.00
480	159	338	10	390.00	260.00	1300.00
481	159	358	10	495.00	330.00	1650.00
482	159	378	10	600.00	400.00	2000.00
483	160	299	1	185.25	123.50	61.75
484	161	300	2	190.50	127.00	127.00
485	161	322	2	306.00	204.00	204.00
486	162	301	3	195.75	130.50	195.75
487	162	324	3	316.50	211.00	316.50
488	162	347	3	437.25	291.50	437.25
489	163	302	4	201.00	134.00	268.00
490	163	326	4	327.00	218.00	436.00
491	163	350	4	453.00	302.00	604.00
492	163	374	4	579.00	386.00	772.00
493	164	303	5	206.25	137.50	343.75
494	164	328	5	337.50	225.00	562.50
495	164	353	5	468.75	312.50	781.25
496	164	378	5	600.00	400.00	1000.00
497	164	403	5	731.25	487.50	1218.75
498	165	304	6	211.50	141.00	423.00
499	166	305	7	216.75	144.50	505.75
500	166	332	7	358.50	239.00	836.50
501	167	306	8	222.00	148.00	592.00
502	167	334	8	369.00	246.00	984.00
503	167	362	8	516.00	344.00	1376.00
504	168	307	9	227.25	151.50	681.75
505	168	336	9	379.50	253.00	1138.50
506	168	365	9	531.75	354.50	1595.25
507	168	394	9	684.00	456.00	2052.00
508	169	308	10	232.50	155.00	775.00
509	169	338	10	390.00	260.00	1300.00
510	169	368	10	547.50	365.00	1825.00
511	169	398	10	705.00	470.00	2350.00
512	169	289	10	132.75	88.50	442.50
513	170	309	1	237.75	158.50	79.25
514	171	310	2	243.00	162.00	162.00
515	171	342	2	411.00	274.00	274.00
516	172	311	3	248.25	165.50	248.25
517	172	344	3	421.50	281.00	421.50
518	172	377	3	594.75	396.50	594.75
519	173	312	4	253.50	169.00	338.00
520	173	346	4	432.00	288.00	576.00
521	173	380	4	610.50	407.00	814.00
522	173	414	4	789.00	526.00	1052.00
523	174	313	5	258.75	172.50	431.25
524	174	348	5	442.50	295.00	737.50
525	174	383	5	626.25	417.50	1043.75
526	174	280	5	85.50	57.00	142.50
527	174	314	5	264.00	176.00	440.00
528	175	314	6	264.00	176.00	528.00
529	176	315	7	269.25	179.50	628.25
530	176	352	7	463.50	309.00	1081.50
531	177	316	8	274.50	183.00	732.00
532	177	354	8	474.00	316.00	1264.00
533	177	392	8	673.50	449.00	1796.00
534	178	317	9	279.75	186.50	839.25
535	178	356	9	484.50	323.00	1453.50
536	178	395	9	689.25	459.50	2067.75
537	178	295	9	164.25	109.50	492.75
538	179	318	10	285.00	190.00	950.00
539	179	358	10	495.00	330.00	1650.00
540	179	398	10	705.00	470.00	2350.00
541	179	299	10	185.25	123.50	617.50
542	179	339	10	395.25	263.50	1317.50
543	180	319	1	290.25	193.50	96.75
544	181	320	2	295.50	197.00	197.00
545	181	362	2	516.00	344.00	344.00
546	182	321	3	300.75	200.50	300.75
547	182	364	3	526.50	351.00	526.50
548	182	407	3	752.25	501.50	752.25
549	183	322	4	306.00	204.00	408.00
550	183	366	4	537.00	358.00	716.00
551	183	410	4	768.00	512.00	1024.00
552	183	315	4	269.25	179.50	359.00
553	184	323	5	311.25	207.50	518.75
554	184	368	5	547.50	365.00	912.50
555	184	413	5	783.75	522.50	1306.25
556	184	319	5	290.25	193.50	483.75
557	184	364	5	526.50	351.00	877.50
558	185	324	6	316.50	211.00	633.00
559	186	325	7	321.75	214.50	750.75
560	186	372	7	568.50	379.00	1326.50
561	187	326	8	327.00	218.00	872.00
562	187	374	8	579.00	386.00	1544.00
563	187	1	8	600.00	500.00	800.00
564	188	327	9	332.25	221.50	996.75
565	188	376	9	589.50	393.00	1768.50
566	188	286	9	117.00	78.00	351.00
567	188	335	9	374.25	249.50	1122.75
568	189	328	10	337.50	225.00	1125.00
569	189	378	10	600.00	400.00	2000.00
570	189	289	10	132.75	88.50	442.50
571	189	339	10	395.25	263.50	1317.50
572	189	389	10	657.75	438.50	2192.50
573	190	329	1	342.75	228.50	114.25
574	191	330	2	348.00	232.00	232.00
575	191	382	2	621.00	414.00	414.00
576	192	331	3	353.25	235.50	353.25
577	192	384	3	631.50	421.00	631.50
578	192	298	3	180.00	120.00	180.00
579	193	332	4	358.50	239.00	478.00
580	193	386	4	642.00	428.00	856.00
581	193	301	4	195.75	130.50	261.00
582	193	355	4	479.25	319.50	639.00
583	194	333	5	363.75	242.50	606.25
584	194	388	5	652.50	435.00	1087.50
585	194	304	5	211.50	141.00	352.50
586	194	359	5	500.25	333.50	833.75
587	194	414	5	789.00	526.00	1315.00
588	195	334	6	369.00	246.00	738.00
589	196	335	7	374.25	249.50	873.25
590	196	392	7	673.50	449.00	1571.50
591	197	336	8	379.50	253.00	1012.00
592	197	394	8	684.00	456.00	1824.00
593	197	313	8	258.75	172.50	690.00
594	198	337	9	384.75	256.50	1154.25
595	198	396	9	694.50	463.00	2083.50
596	198	316	9	274.50	183.00	823.50
597	198	375	9	584.25	389.50	1752.75
598	199	338	10	390.00	260.00	1300.00
599	199	398	10	705.00	470.00	2350.00
600	199	319	10	290.25	193.50	967.50
601	199	379	10	605.25	403.50	2017.50
602	199	300	10	190.50	127.00	635.00
603	200	339	1	395.25	263.50	131.75
604	201	340	2	400.50	267.00	267.00
605	201	402	2	726.00	484.00	484.00
606	202	281	100	90.75	60.50	3025.00
607	203	281	45	90.75	60.50	1361.25
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales (sale_id, invoice_number, date, customer_name, total_amount, total_profit, customer_id, payment_type, paid_amount, discount, tax, subtotal, is_finalized, finalized_at, finalized_by, created_by, updated_by) FROM stdin;
102	INV-20251121-0001	2025-11-21 14:57:54.237234	Walk-in Customer	551.25	137.81	\N	card	551.25	0.00	26.25	525.00	f	\N	\N	\N	\N
1	INV-0001	2026-01-18 13:26:04.910108	\N	600.00	100.00	\N	cash	600.00	0.00	0.00	600.00	f	\N	\N	\N	\N
103	INV-20250802-0002	2025-08-02 13:08:39.172273	Walk-in Customer	577.50	144.38	\N	credit	288.75	0.00	27.50	550.00	f	\N	\N	\N	\N
104	INV-20251207-0003	2025-12-07 17:01:05.687307	\N	603.75	150.94	828	cash	603.75	0.00	28.75	575.00	f	\N	\N	\N	\N
105	INV-20250924-0004	2025-09-24 17:52:52.749648	\N	630.00	157.50	829	cash	630.00	0.00	30.00	600.00	f	\N	\N	\N	\N
106	INV-20250914-0005	2025-09-14 08:08:32.268338	\N	625.00	156.25	830	cash	625.00	31.25	31.25	625.00	f	\N	\N	\N	\N
107	INV-20251026-0006	2025-10-26 04:11:03.58155	\N	682.50	170.63	831	cash	682.50	0.00	32.50	650.00	f	\N	\N	\N	\N
108	INV-20251105-0007	2025-11-05 15:28:15.681197	\N	708.75	177.19	832	cash	708.75	0.00	33.75	675.00	f	\N	\N	\N	\N
109	INV-20251209-0008	2025-12-09 21:42:25.264775	\N	735.00	183.75	833	cash	735.00	0.00	35.00	700.00	f	\N	\N	\N	\N
110	INV-20251212-0009	2025-12-12 13:13:13.042188	\N	761.25	190.31	834	cash	761.25	0.00	36.25	725.00	f	\N	\N	\N	\N
111	INV-20251014-0010	2025-10-14 20:16:55.400953	Walk-in Customer	750.00	187.50	\N	cash	750.00	37.50	37.50	750.00	f	\N	\N	\N	\N
112	INV-20251219-0011	2025-12-19 10:38:56.177976	Walk-in Customer	813.75	203.44	\N	card	813.75	0.00	38.75	775.00	f	\N	\N	\N	\N
113	INV-20250820-0012	2025-08-20 12:34:57.909741	Walk-in Customer	840.00	210.00	\N	credit	420.00	0.00	40.00	800.00	f	\N	\N	\N	\N
114	INV-20251106-0013	2025-11-06 14:09:53.40068	\N	866.25	216.56	838	cash	866.25	0.00	41.25	825.00	f	\N	\N	\N	\N
115	INV-20251127-0014	2025-11-27 00:20:06.393865	\N	892.50	223.13	839	cash	892.50	0.00	42.50	850.00	f	\N	\N	\N	\N
116	INV-20251013-0015	2025-10-13 21:08:24.888757	\N	875.00	218.75	840	cash	875.00	43.75	43.75	875.00	f	\N	\N	\N	\N
117	INV-20250908-0016	2025-09-08 13:35:51.288212	\N	945.00	236.25	841	cash	945.00	0.00	45.00	900.00	f	\N	\N	\N	\N
118	INV-20251205-0017	2025-12-05 17:49:18.831545	\N	971.25	242.81	842	cash	971.25	0.00	46.25	925.00	f	\N	\N	\N	\N
119	INV-20251009-0018	2025-10-09 07:25:59.46543	\N	997.50	249.38	843	cash	997.50	0.00	47.50	950.00	f	\N	\N	\N	\N
120	INV-20251011-0019	2025-10-11 19:47:36.033327	\N	1023.75	255.94	844	cash	1023.75	0.00	48.75	975.00	f	\N	\N	\N	\N
121	INV-20250819-0020	2025-08-19 01:00:12.733585	Walk-in Customer	1000.00	250.00	\N	cash	1000.00	50.00	50.00	1000.00	f	\N	\N	\N	\N
122	INV-20251128-0021	2025-11-28 17:44:03.447197	Walk-in Customer	1076.25	269.06	\N	card	1076.25	0.00	51.25	1025.00	f	\N	\N	\N	\N
123	INV-20251125-0022	2025-11-25 02:59:15.62476	Walk-in Customer	1102.50	275.63	\N	credit	551.25	0.00	52.50	1050.00	f	\N	\N	\N	\N
124	INV-20251203-0023	2025-12-03 20:37:44.80306	\N	1128.75	282.19	848	cash	1128.75	0.00	53.75	1075.00	f	\N	\N	\N	\N
125	INV-20260114-0024	2026-01-14 11:43:12.237948	\N	1155.00	288.75	849	cash	1155.00	0.00	55.00	1100.00	f	\N	\N	\N	\N
126	INV-20250825-0025	2025-08-25 19:08:31.990192	\N	1125.00	281.25	850	cash	1125.00	56.25	56.25	1125.00	f	\N	\N	\N	\N
127	INV-20251202-0026	2025-12-02 08:16:48.29075	\N	1207.50	301.88	851	cash	1207.50	0.00	57.50	1150.00	f	\N	\N	\N	\N
128	INV-20251005-0027	2025-10-05 18:24:14.879419	\N	1233.75	308.44	852	cash	1233.75	0.00	58.75	1175.00	f	\N	\N	\N	\N
129	INV-20251116-0028	2025-11-16 18:56:26.231059	\N	1260.00	315.00	853	cash	1260.00	0.00	60.00	1200.00	f	\N	\N	\N	\N
130	INV-20250803-0029	2025-08-03 10:43:24.824214	\N	1286.25	321.56	854	cash	1286.25	0.00	61.25	1225.00	f	\N	\N	\N	\N
131	INV-20251003-0030	2025-10-03 08:37:33.91912	Walk-in Customer	1250.00	312.50	\N	cash	1250.00	62.50	62.50	1250.00	f	\N	\N	\N	\N
132	INV-20250813-0031	2025-08-13 10:53:49.525882	Walk-in Customer	1338.75	334.69	\N	card	1338.75	0.00	63.75	1275.00	f	\N	\N	\N	\N
133	INV-20250824-0032	2025-08-24 01:01:57.034864	Walk-in Customer	1365.00	341.25	\N	credit	682.50	0.00	65.00	1300.00	f	\N	\N	\N	\N
134	INV-20251103-0033	2025-11-03 00:07:40.043342	\N	1391.25	347.81	858	cash	1391.25	0.00	66.25	1325.00	f	\N	\N	\N	\N
135	INV-20250915-0034	2025-09-15 12:24:23.760961	\N	1417.50	354.38	859	cash	1417.50	0.00	67.50	1350.00	f	\N	\N	\N	\N
136	INV-20250930-0035	2025-09-30 16:13:14.382656	\N	1375.00	343.75	860	cash	1375.00	68.75	68.75	1375.00	f	\N	\N	\N	\N
137	INV-20251105-0036	2025-11-05 02:16:17.293236	\N	1470.00	367.50	861	cash	1470.00	0.00	70.00	1400.00	f	\N	\N	\N	\N
138	INV-20251113-0037	2025-11-13 19:42:46.645508	\N	1496.25	374.06	862	cash	1496.25	0.00	71.25	1425.00	f	\N	\N	\N	\N
139	INV-20250905-0038	2025-09-05 16:37:29.922271	\N	1522.50	380.63	863	cash	1522.50	0.00	72.50	1450.00	f	\N	\N	\N	\N
140	INV-20250902-0039	2025-09-02 04:23:39.484037	\N	1548.75	387.19	864	cash	1548.75	0.00	73.75	1475.00	f	\N	\N	\N	\N
141	INV-20251129-0040	2025-11-29 04:55:51.723769	Walk-in Customer	1500.00	375.00	\N	cash	1500.00	75.00	75.00	1500.00	f	\N	\N	\N	\N
142	INV-20251115-0041	2025-11-15 08:07:09.80384	Walk-in Customer	1601.25	400.31	\N	card	1601.25	0.00	76.25	1525.00	f	\N	\N	\N	\N
143	INV-20251114-0042	2025-11-14 21:46:55.348853	Walk-in Customer	1627.50	406.88	\N	credit	813.75	0.00	77.50	1550.00	f	\N	\N	\N	\N
144	INV-20251106-0043	2025-11-06 04:10:20.904601	\N	1653.75	413.44	868	cash	1653.75	0.00	78.75	1575.00	f	\N	\N	\N	\N
145	INV-20250831-0044	2025-08-31 15:49:20.587402	\N	1680.00	420.00	869	cash	1680.00	0.00	80.00	1600.00	f	\N	\N	\N	\N
146	INV-20251123-0045	2025-11-23 22:25:26.701835	\N	1625.00	406.25	870	cash	1625.00	81.25	81.25	1625.00	f	\N	\N	\N	\N
147	INV-20250725-0046	2025-07-25 23:00:53.838389	\N	1732.50	433.13	871	cash	1732.50	0.00	82.50	1650.00	f	\N	\N	\N	\N
148	INV-20260114-0047	2026-01-14 16:21:43.193756	\N	1758.75	439.69	872	cash	1758.75	0.00	83.75	1675.00	f	\N	\N	\N	\N
149	INV-20251003-0048	2025-10-03 04:59:51.223271	\N	1785.00	446.25	873	cash	1785.00	0.00	85.00	1700.00	f	\N	\N	\N	\N
150	INV-20251225-0049	2025-12-25 23:58:19.361281	\N	1811.25	452.81	874	cash	1811.25	0.00	86.25	1725.00	f	\N	\N	\N	\N
151	INV-20251007-0050	2025-10-07 14:01:54.208247	Walk-in Customer	1750.00	437.50	\N	cash	1750.00	87.50	87.50	1750.00	f	\N	\N	\N	\N
152	INV-20251025-0051	2025-10-25 01:34:07.25979	Walk-in Customer	1863.75	465.94	\N	card	1863.75	0.00	88.75	1775.00	f	\N	\N	\N	\N
153	INV-20250913-0052	2025-09-13 00:35:24.526872	Walk-in Customer	1890.00	472.50	\N	credit	945.00	0.00	90.00	1800.00	f	\N	\N	\N	\N
154	INV-20250802-0053	2025-08-02 09:56:23.002473	\N	1916.25	479.06	878	cash	1916.25	0.00	91.25	1825.00	f	\N	\N	\N	\N
155	INV-20251117-0054	2025-11-17 11:00:41.648232	\N	1942.50	485.63	879	cash	1942.50	0.00	92.50	1850.00	f	\N	\N	\N	\N
156	INV-20251121-0055	2025-11-21 05:46:03.200418	\N	1875.00	468.75	880	cash	1875.00	93.75	93.75	1875.00	f	\N	\N	\N	\N
157	INV-20251021-0056	2025-10-21 08:03:33.012668	\N	1995.00	498.75	881	cash	1995.00	0.00	95.00	1900.00	f	\N	\N	\N	\N
158	INV-20251124-0057	2025-11-24 16:45:31.077437	\N	2021.25	505.31	882	cash	2021.25	0.00	96.25	1925.00	f	\N	\N	\N	\N
159	INV-20251119-0058	2025-11-19 22:07:24.290196	\N	2047.50	511.88	883	cash	2047.50	0.00	97.50	1950.00	f	\N	\N	\N	\N
160	INV-20250916-0059	2025-09-16 05:11:33.165522	\N	2073.75	518.44	884	cash	2073.75	0.00	98.75	1975.00	f	\N	\N	\N	\N
161	INV-20250813-0060	2025-08-13 02:32:00.682572	Walk-in Customer	2000.00	500.00	\N	cash	2000.00	100.00	100.00	2000.00	f	\N	\N	\N	\N
162	INV-20260113-0061	2026-01-13 21:52:36.644382	Walk-in Customer	2126.25	531.56	\N	card	2126.25	0.00	101.25	2025.00	f	\N	\N	\N	\N
163	INV-20250813-0062	2025-08-13 02:30:03.518274	Walk-in Customer	2152.50	538.13	\N	credit	1076.25	0.00	102.50	2050.00	f	\N	\N	\N	\N
164	INV-20250917-0063	2025-09-17 17:25:11.209981	\N	2178.75	544.69	888	cash	2178.75	0.00	103.75	2075.00	f	\N	\N	\N	\N
165	INV-20251021-0064	2025-10-21 22:38:16.009973	\N	2205.00	551.25	889	cash	2205.00	0.00	105.00	2100.00	f	\N	\N	\N	\N
166	INV-20251109-0065	2025-11-09 23:13:40.598046	\N	2125.00	531.25	890	cash	2125.00	106.25	106.25	2125.00	f	\N	\N	\N	\N
167	INV-20251125-0066	2025-11-25 06:08:48.77061	\N	2257.50	564.38	891	cash	2257.50	0.00	107.50	2150.00	f	\N	\N	\N	\N
168	INV-20251021-0067	2025-10-21 12:54:40.475133	\N	2283.75	570.94	892	cash	2283.75	0.00	108.75	2175.00	f	\N	\N	\N	\N
169	INV-20251226-0068	2025-12-26 02:39:17.657339	\N	2310.00	577.50	893	cash	2310.00	0.00	110.00	2200.00	f	\N	\N	\N	\N
170	INV-20250812-0069	2025-08-12 16:27:11.525519	\N	2336.25	584.06	894	cash	2336.25	0.00	111.25	2225.00	f	\N	\N	\N	\N
171	INV-20251203-0070	2025-12-03 16:33:47.655911	Walk-in Customer	2250.00	562.50	\N	cash	2250.00	112.50	112.50	2250.00	f	\N	\N	\N	\N
172	INV-20250915-0071	2025-09-15 14:53:33.697802	Walk-in Customer	2388.75	597.19	\N	card	2388.75	0.00	113.75	2275.00	f	\N	\N	\N	\N
173	INV-20251122-0072	2025-11-22 13:16:41.582824	Walk-in Customer	2415.00	603.75	\N	credit	1207.50	0.00	115.00	2300.00	f	\N	\N	\N	\N
174	INV-20251115-0073	2025-11-15 18:39:33.999657	\N	2441.25	610.31	898	cash	2441.25	0.00	116.25	2325.00	f	\N	\N	\N	\N
175	INV-20251115-0074	2025-11-15 16:55:03.047158	\N	2467.50	616.88	899	cash	2467.50	0.00	117.50	2350.00	f	\N	\N	\N	\N
176	INV-20250730-0075	2025-07-30 07:51:32.695294	\N	2375.00	593.75	900	cash	2375.00	118.75	118.75	2375.00	f	\N	\N	\N	\N
177	INV-20251023-0076	2025-10-23 02:59:26.061684	\N	2520.00	630.00	901	cash	2520.00	0.00	120.00	2400.00	f	\N	\N	\N	\N
178	INV-20250811-0077	2025-08-11 13:49:16.394645	\N	2546.25	636.56	902	cash	2546.25	0.00	121.25	2425.00	f	\N	\N	\N	\N
179	INV-20250912-0078	2025-09-12 01:08:08.134291	\N	2572.50	643.13	903	cash	2572.50	0.00	122.50	2450.00	f	\N	\N	\N	\N
180	INV-20251116-0079	2025-11-16 00:12:19.570436	\N	2598.75	649.69	904	cash	2598.75	0.00	123.75	2475.00	f	\N	\N	\N	\N
181	INV-20250830-0080	2025-08-30 15:35:59.871967	Walk-in Customer	2500.00	625.00	\N	cash	2500.00	125.00	125.00	2500.00	f	\N	\N	\N	\N
182	INV-20251022-0081	2025-10-22 14:52:57.147322	Walk-in Customer	2651.25	662.81	\N	card	2651.25	0.00	126.25	2525.00	f	\N	\N	\N	\N
183	INV-20251028-0082	2025-10-28 21:18:11.267933	Walk-in Customer	2677.50	669.38	\N	credit	1338.75	0.00	127.50	2550.00	f	\N	\N	\N	\N
184	INV-20251108-0083	2025-11-08 23:14:56.407931	\N	2703.75	675.94	908	cash	2703.75	0.00	128.75	2575.00	f	\N	\N	\N	\N
185	INV-20260105-0084	2026-01-05 15:28:49.672308	\N	2730.00	682.50	909	cash	2730.00	0.00	130.00	2600.00	f	\N	\N	\N	\N
186	INV-20251122-0085	2025-11-22 08:11:41.643879	\N	2625.00	656.25	910	cash	2625.00	131.25	131.25	2625.00	f	\N	\N	\N	\N
187	INV-20250831-0086	2025-08-31 18:03:19.412141	\N	2782.50	695.63	911	cash	2782.50	0.00	132.50	2650.00	f	\N	\N	\N	\N
188	INV-20260102-0087	2026-01-02 16:50:43.440075	\N	2808.75	702.19	912	cash	2808.75	0.00	133.75	2675.00	f	\N	\N	\N	\N
189	INV-20251014-0088	2025-10-14 13:27:11.448922	\N	2835.00	708.75	913	cash	2835.00	0.00	135.00	2700.00	f	\N	\N	\N	\N
190	INV-20250819-0089	2025-08-19 19:27:49.68737	\N	2861.25	715.31	914	cash	2861.25	0.00	136.25	2725.00	f	\N	\N	\N	\N
191	INV-20251013-0090	2025-10-13 03:05:10.944088	Walk-in Customer	2750.00	687.50	\N	cash	2750.00	137.50	137.50	2750.00	f	\N	\N	\N	\N
192	INV-20260113-0091	2026-01-13 04:25:56.592061	Walk-in Customer	2913.75	728.44	\N	card	2913.75	0.00	138.75	2775.00	f	\N	\N	\N	\N
193	INV-20250922-0092	2025-09-22 20:45:48.414232	Walk-in Customer	2940.00	735.00	\N	credit	1470.00	0.00	140.00	2800.00	f	\N	\N	\N	\N
194	INV-20260106-0093	2026-01-06 17:22:40.292827	\N	2966.25	741.56	918	cash	2966.25	0.00	141.25	2825.00	f	\N	\N	\N	\N
195	INV-20260115-0094	2026-01-15 12:07:13.525238	\N	2992.50	748.13	919	cash	2992.50	0.00	142.50	2850.00	f	\N	\N	\N	\N
196	INV-20251116-0095	2025-11-16 01:04:57.18722	\N	2875.00	718.75	920	cash	2875.00	143.75	143.75	2875.00	f	\N	\N	\N	\N
197	INV-20251003-0096	2025-10-03 19:01:31.502832	\N	3045.00	761.25	921	cash	3045.00	0.00	145.00	2900.00	f	\N	\N	\N	\N
198	INV-20250922-0097	2025-09-22 05:36:04.649726	\N	3071.25	767.81	922	cash	3071.25	0.00	146.25	2925.00	f	\N	\N	\N	\N
199	INV-20260110-0098	2026-01-10 00:29:26.617952	\N	3097.50	774.38	923	cash	3097.50	0.00	147.50	2950.00	f	\N	\N	\N	\N
200	INV-20250730-0099	2025-07-30 09:35:45.168905	\N	3123.75	780.94	924	cash	3123.75	0.00	148.75	2975.00	f	\N	\N	\N	\N
201	INV-20251214-0100	2025-12-14 09:04:52.779259	Walk-in Customer	3000.00	750.00	\N	cash	3000.00	150.00	150.00	3000.00	f	\N	\N	\N	\N
202	INV-20251215	2026-01-21 02:45:21.801906	Muhammad Hussnain	9075.00	3025.00	\N	cash	9075.00	0.00	0.00	9075.00	f	\N	\N	\N	\N
203	INV-20251216	2026-01-21 03:11:14.599027	\N	4083.75	1361.25	\N	cash	4083.75	0.00	0.00	4083.75	f	\N	\N	\N	\N
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, printer_config, language, other_app_settings, first_time_setup_complete) FROM stdin;
3	{"printerName":"Default Printer"}	en	{"theme": "light", "shop_name": "My Shop", "shop_phone": "", "shop_address": "", "backup_config": {"mode": "app_start", "enabled": true, "backupDir": "E:\\\\POS\\\\HisaabKitab\\\\backup", "scheduledTime": "00:26", "retentionCount": 5}, "firstTimeSetupComplete": true}	f
\.


--
-- Data for Name: sub_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sub_categories (sub_category_id, category_id, sub_category_name, status, created_at) FROM stdin;
1	1	Test	active	2026-01-19 13:11:15.079297
1037	272	Copper Wires	active	2026-01-19 14:33:01.012952
1038	272	Aluminum Wires	active	2026-01-19 14:33:01.012952
1039	272	PVC Cables	active	2026-01-19 14:33:01.012952
1040	272	XLPE Cables	active	2026-01-19 14:33:01.012952
1041	272	Armored Cables	active	2026-01-19 14:33:01.012952
1042	272	Flexible Cables	active	2026-01-19 14:33:01.012952
1043	272	Telephone Wires	active	2026-01-19 14:33:01.012952
1044	272	Data Cables	active	2026-01-19 14:33:01.012952
1045	273	Single Pole Switches	active	2026-01-19 14:33:01.012952
1046	273	Double Pole Switches	active	2026-01-19 14:33:01.012952
1047	273	Three Way Switches	active	2026-01-19 14:33:01.012952
1048	273	Socket Outlets	active	2026-01-19 14:33:01.012952
1049	273	USB Sockets	active	2026-01-19 14:33:01.012952
1050	273	Switch Sockets	active	2026-01-19 14:33:01.012952
1051	273	Dimmer Switches	active	2026-01-19 14:33:01.012952
1052	273	Bell Switches	active	2026-01-19 14:33:01.012952
1053	274	LED Bulbs	active	2026-01-19 14:33:01.012952
1054	274	CFL Bulbs	active	2026-01-19 14:33:01.012952
1055	274	Tube Lights	active	2026-01-19 14:33:01.012952
1056	274	Panel Lights	active	2026-01-19 14:33:01.012952
1057	274	Spot Lights	active	2026-01-19 14:33:01.012952
1058	274	Chandeliers	active	2026-01-19 14:33:01.012952
1059	274	Wall Lights	active	2026-01-19 14:33:01.012952
1060	274	Emergency Lights	active	2026-01-19 14:33:01.012952
1061	275	Ceiling Fans	active	2026-01-19 14:33:01.012952
1062	275	Exhaust Fans	active	2026-01-19 14:33:01.012952
1063	275	Table Fans	active	2026-01-19 14:33:01.012952
1064	275	Pedestal Fans	active	2026-01-19 14:33:01.012952
1065	275	Wall Fans	active	2026-01-19 14:33:01.012952
1066	275	Industrial Fans	active	2026-01-19 14:33:01.012952
1067	276	Miniature Circuit Breakers	active	2026-01-19 14:33:01.012952
1068	276	Molded Case Breakers	active	2026-01-19 14:33:01.012952
1069	276	Air Circuit Breakers	active	2026-01-19 14:33:01.012952
1070	276	Residual Current Breakers	active	2026-01-19 14:33:01.012952
1071	277	Single Pole MCB	active	2026-01-19 14:33:01.012952
1072	277	Double Pole MCB	active	2026-01-19 14:33:01.012952
1073	277	Triple Pole MCB	active	2026-01-19 14:33:01.012952
1074	277	Cartridge Fuses	active	2026-01-19 14:33:01.012952
1075	277	Rewirable Fuses	active	2026-01-19 14:33:01.012952
1076	278	PVC Conduit	active	2026-01-19 14:33:01.012952
1077	278	Metal Conduit	active	2026-01-19 14:33:01.012952
1078	278	Flexible Conduit	active	2026-01-19 14:33:01.012952
1079	278	Conduit Fittings	active	2026-01-19 14:33:01.012952
1080	279	Metal Junction Boxes	active	2026-01-19 14:33:01.012952
1081	279	Plastic Junction Boxes	active	2026-01-19 14:33:01.012952
1082	279	Weatherproof Boxes	active	2026-01-19 14:33:01.012952
1083	280	Screwdrivers	active	2026-01-19 14:33:01.012952
1084	280	Pliers	active	2026-01-19 14:33:01.012952
1085	280	Wire Strippers	active	2026-01-19 14:33:01.012952
1086	280	Multimeters	active	2026-01-19 14:33:01.012952
1087	280	Drill Machines	active	2026-01-19 14:33:01.012952
1088	280	Cutting Tools	active	2026-01-19 14:33:01.012952
1089	281	Safety Gloves	active	2026-01-19 14:33:01.012952
1090	281	Safety Glasses	active	2026-01-19 14:33:01.012952
1091	281	Insulating Mats	active	2026-01-19 14:33:01.012952
1092	281	Fire Extinguishers	active	2026-01-19 14:33:01.012952
1093	282	Lead Acid Batteries	active	2026-01-19 14:33:01.012952
1094	282	Lithium Batteries	active	2026-01-19 14:33:01.012952
1095	282	Dry Cell Batteries	active	2026-01-19 14:33:01.012952
1096	285	PVC Pipes	active	2026-01-19 14:33:01.012952
1097	285	GI Pipes	active	2026-01-19 14:33:01.012952
1098	285	CPVC Pipes	active	2026-01-19 14:33:01.012952
1099	285	HDPE Pipes	active	2026-01-19 14:33:01.012952
1100	285	Pipe Fittings	active	2026-01-19 14:33:01.012952
1101	285	Elbows	active	2026-01-19 14:33:01.012952
1102	285	Tees	active	2026-01-19 14:33:01.012952
1103	285	Couplings	active	2026-01-19 14:33:01.012952
1104	286	Ball Valves	active	2026-01-19 14:33:01.012952
1105	286	Gate Valves	active	2026-01-19 14:33:01.012952
1106	286	Check Valves	active	2026-01-19 14:33:01.012952
1107	286	Butterfly Valves	active	2026-01-19 14:33:01.012952
1108	287	Centrifugal Pumps	active	2026-01-19 14:33:01.012952
1109	287	Submersible Pumps	active	2026-01-19 14:33:01.012952
1110	287	Jet Pumps	active	2026-01-19 14:33:01.012952
1111	288	Electric Water Heaters	active	2026-01-19 14:33:01.012952
1112	288	Gas Water Heaters	active	2026-01-19 14:33:01.012952
1113	288	Solar Water Heaters	active	2026-01-19 14:33:01.012952
1114	289	Toilets	active	2026-01-19 14:33:01.012952
1115	289	Basins	active	2026-01-19 14:33:01.012952
1116	289	Faucets	active	2026-01-19 14:33:01.012952
1117	289	Showers	active	2026-01-19 14:33:01.012952
1118	290	Ceramic Tiles	active	2026-01-19 14:33:01.012952
1119	290	Porcelain Tiles	active	2026-01-19 14:33:01.012952
1120	290	Marble Tiles	active	2026-01-19 14:33:01.012952
1121	291	Portland Cement	active	2026-01-19 14:33:01.012952
1122	291	White Cement	active	2026-01-19 14:33:01.012952
1123	291	Mortar Mix	active	2026-01-19 14:33:01.012952
1124	292	Steel Bars	active	2026-01-19 14:33:01.012952
1125	292	Iron Sheets	active	2026-01-19 14:33:01.012952
1126	292	Steel Angles	active	2026-01-19 14:33:01.012952
1127	295	Hooks	active	2026-01-19 14:33:01.012952
1128	295	Brackets	active	2026-01-19 14:33:01.012952
1129	295	Clamps	active	2026-01-19 14:33:01.012952
1130	295	Bolts & Nuts	active	2026-01-19 14:33:01.012952
1131	296	Door Locks	active	2026-01-19 14:33:01.012952
1132	296	Padlocks	active	2026-01-19 14:33:01.012952
1133	296	Cylinder Locks	active	2026-01-19 14:33:01.012952
1134	297	Door Hinges	active	2026-01-19 14:33:01.012952
1135	297	Window Hinges	active	2026-01-19 14:33:01.012952
1136	297	Door Handles	active	2026-01-19 14:33:01.012952
1137	297	Window Handles	active	2026-01-19 14:33:01.012952
1138	298	Wood Screws	active	2026-01-19 14:33:01.012952
1139	298	Machine Screws	active	2026-01-19 14:33:01.012952
1140	298	Nails	active	2026-01-19 14:33:01.012952
1141	298	Anchors	active	2026-01-19 14:33:01.012952
1142	299	Construction Adhesives	active	2026-01-19 14:33:01.012952
1143	299	Wood Adhesives	active	2026-01-19 14:33:01.012952
1144	299	Tile Adhesives	active	2026-01-19 14:33:01.012952
1145	300	Silicone Sealants	active	2026-01-19 14:33:01.012952
1146	300	Acrylic Sealants	active	2026-01-19 14:33:01.012952
1147	300	Polyurethane Sealants	active	2026-01-19 14:33:01.012952
1148	301	Electrical Tape	active	2026-01-19 14:33:01.012952
1149	301	Cable Ties	active	2026-01-19 14:33:01.012952
1150	301	Wire Nuts	active	2026-01-19 14:33:01.012952
1151	301	Cable Clips	active	2026-01-19 14:33:01.012952
\.


--
-- Data for Name: supplier_payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.supplier_payments (payment_id, supplier_id, payment_date, amount, payment_method, notes, created_at) FROM stdin;
1	1084	2025-12-30 10:48:18.561796	5500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
2	1085	2026-01-09 17:36:42.275483	6000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
3	1086	2026-01-16 16:17:26.118635	6500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
4	1087	2025-09-29 23:45:15.230853	7000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
5	1088	2025-09-28 16:51:12.627004	7500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
6	1089	2025-09-19 03:21:28.147311	8000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
7	1090	2025-08-14 19:16:41.563313	8500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
8	1091	2025-12-21 13:17:17.501316	9000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
9	1083	2025-07-24 22:22:33.850736	9500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
10	1084	2025-12-15 10:49:16.736591	10000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
11	1085	2025-11-23 11:53:36.072042	10500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
12	1086	2025-10-16 00:58:03.290137	11000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
13	1087	2026-01-07 11:56:50.268221	11500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
14	1088	2025-12-13 11:45:52.349387	12000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
15	1089	2025-09-21 04:14:56.046856	12500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
16	1090	2025-11-16 21:47:05.590037	13000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
17	1091	2025-12-17 12:08:15.224586	13500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
18	1083	2025-10-29 04:40:14.026698	14000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
19	1084	2025-09-10 19:29:29.69575	14500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
20	1085	2025-12-30 19:47:08.786944	15000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
21	1086	2025-07-26 00:41:52.394569	15500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
22	1087	2026-01-09 17:46:23.645295	16000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
23	1088	2025-08-18 07:58:45.426084	16500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
24	1089	2026-01-15 02:29:03.206338	17000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
25	1090	2025-09-02 08:30:41.396875	17500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
26	1091	2025-10-22 17:05:50.896137	18000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
27	1083	2025-09-14 08:02:52.126217	18500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
28	1084	2025-12-02 15:52:22.101572	19000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
29	1085	2025-10-08 01:28:22.385716	19500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
30	1086	2025-12-03 06:30:21.287379	20000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
31	1087	2025-09-29 00:27:08.931966	20500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
32	1088	2025-11-15 22:29:12.385182	21000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
33	1089	2025-09-02 19:57:47.61026	21500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
34	1090	2025-08-22 18:51:53.853087	22000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
35	1091	2025-10-26 19:08:40.864086	22500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
36	1083	2025-08-09 03:06:33.572999	23000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
37	1084	2025-12-15 02:27:01.406414	23500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
38	1085	2025-11-20 15:43:39.280206	24000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
39	1086	2025-10-16 07:11:12.544844	24500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
40	1087	2025-08-01 11:25:45.84505	25000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
41	1088	2025-11-05 19:20:54.282814	25500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
42	1089	2025-08-28 18:39:57.997624	26000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
43	1090	2025-12-25 22:40:53.007057	26500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
44	1091	2026-01-14 15:24:51.390618	27000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
45	1083	2025-12-17 10:09:08.773496	27500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
46	1084	2025-09-21 04:40:28.317274	28000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
47	1085	2026-01-15 03:22:01.910767	28500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
48	1086	2025-08-19 15:13:28.580051	29000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
49	1087	2025-12-14 02:38:52.308474	29500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
50	1088	2025-12-17 10:18:29.055751	30000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
51	1089	2025-08-28 19:33:14.621293	30500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
52	1090	2025-12-11 07:51:06.005548	31000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
53	1091	2025-09-03 21:51:17.049717	31500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
54	1083	2025-09-03 12:28:18.225705	32000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
55	1084	2025-12-01 09:48:25.459579	32500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
56	1085	2025-11-09 10:06:53.932054	33000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
57	1086	2025-10-10 16:14:33.954249	33500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
58	1087	2025-11-25 14:30:48.247654	34000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
59	1088	2025-08-21 15:34:12.661503	34500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
60	1089	2025-10-24 19:15:10.806505	35000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
61	1090	2025-09-28 16:16:41.583388	35500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
62	1091	2025-09-20 15:37:39.092535	36000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
63	1083	2025-07-27 16:33:08.203782	36500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
64	1084	2025-09-25 17:35:33.688538	37000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
65	1085	2025-09-29 17:32:00.797863	37500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
66	1086	2025-11-16 07:00:04.05997	38000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
67	1087	2025-08-29 01:37:51.792582	38500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
68	1088	2025-12-15 08:43:48.406786	39000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
69	1089	2026-01-08 19:16:26.596033	39500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
70	1090	2025-12-11 07:24:43.408953	40000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
71	1091	2025-12-07 16:11:17.776646	40500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
72	1083	2025-12-08 02:20:05.365429	41000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
73	1084	2025-08-13 21:28:43.64841	41500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
74	1085	2025-09-19 09:41:06.100203	42000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
75	1086	2025-09-05 20:58:01.371279	42500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
76	1087	2025-12-14 22:52:33.451786	43000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
77	1088	2025-09-24 00:25:42.860632	43500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
78	1089	2025-08-23 11:27:27.994869	44000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
79	1090	2026-01-19 10:23:05.024536	44500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
80	1091	2025-11-30 01:19:35.10506	45000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
81	1083	2025-10-13 10:31:01.298182	45500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
82	1084	2025-08-16 07:51:03.378654	46000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
83	1085	2025-07-25 16:27:28.668031	46500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
84	1086	2025-10-02 06:19:14.438826	47000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
85	1087	2025-08-31 08:13:06.553941	47500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
86	1088	2025-11-15 08:45:46.384968	48000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
87	1089	2025-08-06 18:05:10.70265	48500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
88	1090	2025-09-06 16:46:53.901578	49000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
89	1091	2025-09-12 13:38:19.741316	49500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
90	1083	2025-08-11 17:36:17.377098	50000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
91	1084	2025-12-29 16:25:43.178872	50500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
92	1085	2025-11-17 08:43:58.001112	51000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
93	1086	2025-08-15 21:06:51.017082	51500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
94	1087	2025-11-02 00:34:17.61395	52000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
95	1088	2025-09-04 12:06:31.200107	52500.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
96	1089	2025-09-26 06:09:09.906367	53000.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
97	1090	2025-09-02 14:09:48.315519	53500.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
98	1091	2025-09-22 12:40:45.947885	54000.00	cheque	Payment against supplier balance	2026-01-19 14:33:01.012952
99	1083	2025-11-12 15:38:14.877227	54500.00	cash	Payment against supplier balance	2026-01-19 14:33:01.012952
100	1084	2026-01-01 13:19:11.540574	55000.00	bank_transfer	Payment against supplier balance	2026-01-19 14:33:01.012952
101	1061	2026-01-19 05:00:00	20000.00	cash	Paid Previous Debt	2026-01-20 02:35:38.455603
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (supplier_id, name, contact_number, total_purchased, total_paid, balance, opening_balance, status, created_at) FROM stdin;
1092	What do you want in next meeting	867	0.00	0.00	0.00	0.00	active	2026-01-24 06:02:41.096716
1	Asad Ali	02423423423	50000.00	50000.00	0.00	0.00	active	2026-01-19 02:44:32.55414
1010	Abbottabad Supplies	099-8901234	700000.00	690000.00	10000.00	0.00	active	2026-01-19 14:33:01.012952
983	Al-Karam Electricals	0300-1234567	500000.00	450000.00	50000.00	0.00	active	2026-01-19 14:33:01.012952
1089	Awaran Electricals	081-7890123	550000.00	549500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
1001	Bahawalpur Supplies	062-9012345	600000.00	580000.00	20000.00	0.00	active	2026-01-19 14:33:01.012952
990	Balochistan Building Materials	081-8901234	550000.00	520000.00	30000.00	0.00	active	2026-01-19 14:33:01.012952
1086	Chagai Supplies	081-4567890	700000.00	699500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
1085	Killa Abdullah Hardware	081-3456789	650000.00	649500.00	-313000.00	0.00	active	2026-01-19 14:33:01.012952
1087	Nushki Wires	081-5678901	800000.00	799500.00	-324000.00	0.00	active	2026-01-19 14:33:01.012952
1088	Washuk Tools	081-6789012	600000.00	599500.00	-329500.00	0.00	active	2026-01-19 14:33:01.012952
1090	Lasbela Hardware	081-8901234	650000.00	649500.00	-340500.00	0.00	active	2026-01-19 14:33:01.012952
1091	Kech Supplies	085-9012345	700000.00	699500.00	-346000.00	0.00	active	2026-01-19 14:33:01.012952
1083	Killa Saifullah Building Materials	083-1234567	600000.00	599500.00	-351500.00	0.00	active	2026-01-19 14:33:01.012952
1084	Pishin Electricals	081-2345678	750000.00	749500.00	-362500.00	0.00	active	2026-01-19 14:33:01.012952
984	Hassan Hardware Store	0312-2345678	750000.00	700000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
985	Karachi Wires & Cables	021-3456789	1200000.00	1100000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
986	Lahore Switchgear	042-4567890	800000.00	750000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
987	Islamabad Lighting Solutions	051-5678901	600000.00	580000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
988	Punjab Pipes & Fittings	042-6789012	900000.00	850000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
989	Sindh Tools & Equipment	021-7890123	650000.00	600000.00	7422.50	0.00	active	2026-01-19 14:33:01.012952
991	KPK Electrical Components	091-9012345	700000.00	680000.00	6119.50	0.00	active	2026-01-19 14:33:01.012952
992	Rawalpindi Wires	051-0123456	850000.00	800000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
993	Faisalabad Cables	041-1234567	950000.00	900000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
994	Multan Hardware	061-2345678	600000.00	570000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
995	Gujranwala Electricals	055-3456789	750000.00	720000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
996	Sialkot Tools	052-4567890	550000.00	530000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
997	Quetta Supplies	081-5678901	500000.00	480000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
998	Peshawar Wholesale	091-6789012	800000.00	770000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
999	Hyderabad Electricals	022-7890123	650000.00	630000.00	2956.50	0.00	active	2026-01-19 14:33:01.012952
1000	Sargodha Hardware	048-8901234	700000.00	680000.00	12122.50	0.00	active	2026-01-19 14:33:01.012952
1002	Sukkur Building Materials	071-0123456	550000.00	540000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1003	Jhang Electricals	047-1234567	750000.00	730000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1004	Sheikhupura Hardware	056-2345678	650000.00	630000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1005	Rahim Yar Khan Supplies	068-3456789	700000.00	680000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1006	Gujrat Wires	053-4567890	800000.00	780000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1007	Kasur Tools	049-5678901	600000.00	590000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1008	Mardan Electricals	093-6789012	550000.00	540000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1009	Mingora Hardware	094-7890123	650000.00	640000.00	10776.50	0.00	active	2026-01-19 14:33:01.012952
1011	Dera Ghazi Khan	064-9012345	600000.00	590000.00	5908.50	0.00	active	2026-01-19 14:33:01.012952
1012	Sahiwal Electricals	040-0123456	750000.00	740000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1013	Okara Hardware	044-1234567	650000.00	640000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1014	Chiniot Supplies	041-2345678	700000.00	690000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1015	Kamoke Wires	054-3456789	800000.00	790000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1016	Hafizabad Tools	054-4567890	600000.00	590000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1017	Kotri Electricals	022-5678901	550000.00	545000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1018	Mirpur Khas Hardware	023-6789012	650000.00	645000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1019	Nawabshah Supplies	024-7890123	700000.00	695000.00	31272.50	0.00	active	2026-01-19 14:33:01.012952
1020	Larkana Building Materials	074-8901234	600000.00	595000.00	8784.00	0.00	active	2026-01-19 14:33:01.012952
1021	Jacobabad Electricals	072-9012345	750000.00	745000.00	10422.50	0.00	active	2026-01-19 14:33:01.012952
1022	Shikarpur Hardware	076-0123456	650000.00	648000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1023	Khairpur Supplies	024-1234567	700000.00	698000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1024	Sukkur Wires	071-2345678	800000.00	798000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1025	Rohri Tools	071-3456789	600000.00	599000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1026	Ghotki Electricals	072-4567890	550000.00	549000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1027	Kandhkot Hardware	072-5678901	650000.00	649000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1028	Kashmore Supplies	072-6789012	700000.00	699000.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1029	Dadu Building Materials	025-7890123	600000.00	599500.00	12226.50	0.00	active	2026-01-19 14:33:01.012952
1030	Jamshoro Electricals	022-8901234	750000.00	749500.00	14113.00	0.00	active	2026-01-19 14:33:01.012952
1031	Thatta Hardware	029-9012345	650000.00	649500.00	16918.50	0.00	active	2026-01-19 14:33:01.012952
1033	Tando Adam Wires	023-1234567	800000.00	799500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1034	Tando Allahyar Tools	023-2345678	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1035	Matli Electricals	029-3456789	550000.00	549500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1036	Digri Hardware	023-4567890	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1037	Umerkot Supplies	023-5678901	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1038	Khipro Building Materials	023-6789012	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1039	Sanghar Electricals	023-7890123	750000.00	749500.00	20588.50	0.00	active	2026-01-19 14:33:01.012952
1040	Kunri Hardware	023-8901234	650000.00	649500.00	27151.50	0.00	active	2026-01-19 14:33:01.012952
1041	Samaro Supplies	023-9012345	700000.00	699500.00	17698.50	0.00	active	2026-01-19 14:33:01.012952
1042	Chhor Wires	023-0123456	800000.00	799500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1043	Mithi Tools	023-1234567	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1044	Islamkot Electricals	023-2345678	550000.00	549500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1045	Nagarparkar Hardware	023-3456789	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1046	Mithiani Supplies	023-4567890	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1047	Daharki Building Materials	072-5678901	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1048	Pano Aqil Electricals	071-6789012	750000.00	749500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1049	Garhi Khairo Hardware	072-7890123	650000.00	649500.00	28986.50	0.00	active	2026-01-19 14:33:01.012952
1050	Kandiaro Supplies	024-8901234	700000.00	699500.00	22464.00	0.00	active	2026-01-19 14:33:01.012952
1051	Naushahro Feroze Wires	024-9012345	800000.00	799500.00	26668.50	0.00	active	2026-01-19 14:33:01.012952
1052	Moro Tools	024-0123456	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1054	Mehrabpur Hardware	024-2345678	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1055	Daur Supplies	024-3456789	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1056	Bhirkan Building Materials	024-4567890	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1057	Keti Bunder Electricals	029-5678901	750000.00	749500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1058	Shahbandar Hardware	029-6789012	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1059	Jati Supplies	029-7890123	700000.00	699500.00	27796.50	0.00	active	2026-01-19 14:33:01.012952
1062	Pasni Electricals	029-0123456	550000.00	549500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1063	Gwadar Hardware	086-1234567	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1064	Turbat Supplies	085-2345678	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1065	Panjgur Building Materials	085-3456789	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1066	Khuzdar Electricals	084-4567890	750000.00	749500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1067	Kalat Hardware	084-5678901	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1068	Mastung Supplies	084-6789012	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1069	Quetta Wires	081-7890123	800000.00	799500.00	39018.50	0.00	active	2026-01-19 14:33:01.012952
1070	Chaman Tools	082-8901234	600000.00	599500.00	41207.00	0.00	active	2026-01-19 14:33:01.012952
1071	Zhob Electricals	083-9012345	550000.00	549500.00	35788.50	0.00	active	2026-01-19 14:33:01.012952
1072	Loralai Hardware	083-0123456	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1073	Dera Bugti Supplies	083-1234567	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1074	Sibi Building Materials	083-2345678	600000.00	599500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1075	Naseerabad Electricals	083-3456789	750000.00	749500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1076	Jaffarabad Hardware	083-4567890	650000.00	649500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1077	Kohlu Supplies	083-5678901	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1079	Musakhel Tools	083-7890123	600000.00	599500.00	20059.00	0.00	active	2026-01-19 14:33:01.012952
1080	Sherani Electricals	083-8901234	550000.00	549500.00	6681.00	0.00	active	2026-01-19 14:33:01.012952
1081	Ziarat Hardware	083-9012345	650000.00	649500.00	18417.00	0.00	active	2026-01-19 14:33:01.012952
1082	Harnai Supplies	083-0123456	700000.00	699500.00	0.00	0.00	active	2026-01-19 14:33:01.012952
1061	Ormara Tools	029-9012345	600000.00	599500.00	40483.50	0.00	active	2026-01-19 14:33:01.012952
1032	Badin Supplies	029-0123456	700000.00	699500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
1060	Bela Wires	029-8901234	800000.00	799500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
1053	Bhiria Electricals	024-1234567	550000.00	549500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
1078	Barkhan Wires	083-6789012	800000.00	799500.00	500.00	0.00	active	2026-01-19 14:33:01.012952
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (session_id, user_id, device_id, ip_address, user_agent, created_at, expires_at, last_activity) FROM stdin;
4c650a16-2c9e-4ce1-8185-3fb2ac997292	1	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:22:36.735249	2026-01-26 17:22:36.733	2026-01-25 17:25:25.57017
9d5c0f93-503c-4c38-9dc9-498ea31efab0	1	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 14:35:40.74329	2026-01-26 14:35:40.742	2026-01-25 14:38:02.150494
6308bee7-ebd7-4d45-aa36-560ee5e86119	2	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-26 16:16:00.656529	2026-01-27 16:16:00.651	2026-01-26 16:18:01.927932
a45d29f9-c221-4e0d-8dc9-c974d15c408c	1	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:15:28.715005	2026-01-26 17:15:28.713	2026-01-25 17:18:32.794272
6ba619ab-58b9-4657-aae2-e6d71e5e3dd4	1	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:18:42.772413	2026-01-26 17:18:42.771	2026-01-25 17:20:20.597138
1856fa4a-cc40-4935-b38f-e18eeacc7a04	1	unknown	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) hisaabkitab/1.0.0 Chrome/120.0.6099.291 Electron/28.3.3 Safari/537.36	2026-01-25 17:20:30.449117	2026-01-26 17:20:30.448	2026-01-25 17:22:29.012144
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, password_hash, name, role, pin_hash, is_active, created_at, updated_at, last_login, password_reset_token, password_reset_expires, security_question, security_answer_hash) FROM stdin;
1	admin	$2b$10$hM9svBmzK.fY3OvMd3lJe.WzXw91xbQMb0/7VOFIvUUzU080n4LV.	Ali Store	administrator	$2b$10$w/v2PasiZ0kn9lCgnUM09eO/5.gD6TTmehiomGswB51wnnJSCmH3.	t	2026-01-25 14:35:25.422409	2026-01-25 14:35:25.422409	2026-01-26 15:47:06.714559	\N	\N	Your best friend name	$2b$10$fqSC7367ZcpQIVQ0sfplC.nO8Sen9H3ueXGh5dNaKWghqHJsyS.9K
2	Cashier	$2b$10$3f4CUQm1wrF7Yo8v1AjMs.lXgMvUbIrSvgMXigiv76PJEt.Dd1uES	Hussnain	cashier	$2b$10$maodyMWoen4scAPeVhN4guQGpknB9m7qRAeKoM195E85MLqbYRz/6	t	2026-01-26 01:39:37.224922	2026-01-26 01:39:37.224922	2026-01-26 16:16:00.65843	11b5c2717006cf85459dcfeb92210f02deab0fddfe3ccbc1a696dd7d92bdd95c	2026-01-26 02:48:12.101	\N	\N
\.


--
-- Name: audit_logs_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_log_id_seq', 52, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 302, true);


--
-- Name: customer_payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_payments_payment_id_seq', 100, true);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 930, true);


--
-- Name: daily_expenses_expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.daily_expenses_expense_id_seq', 101, true);


--
-- Name: encryption_keys_key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.encryption_keys_key_id_seq', 1, false);


--
-- Name: license_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.license_info_id_seq', 11, true);


--
-- Name: license_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.license_logs_id_seq', 1287, true);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_product_id_seq', 417, true);


--
-- Name: purchase_items_purchase_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchase_items_purchase_item_id_seq', 405, true);


--
-- Name: purchases_purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchases_purchase_id_seq', 205, true);


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_items_sale_item_id_seq', 607, true);


--
-- Name: sales_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_sale_id_seq', 203, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 3, true);


--
-- Name: sub_categories_sub_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sub_categories_sub_category_id_seq', 1151, true);


--
-- Name: supplier_payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.supplier_payments_payment_id_seq', 101, true);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_supplier_id_seq', 1092, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 2, true);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id);


--
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: customer_payments customer_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_payments
    ADD CONSTRAINT customer_payments_pkey PRIMARY KEY (payment_id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: daily_expenses daily_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_expenses
    ADD CONSTRAINT daily_expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: encryption_keys encryption_keys_key_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.encryption_keys
    ADD CONSTRAINT encryption_keys_key_name_key UNIQUE (key_name);


--
-- Name: encryption_keys encryption_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.encryption_keys
    ADD CONSTRAINT encryption_keys_pkey PRIMARY KEY (key_id);


--
-- Name: license_info license_info_license_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_info
    ADD CONSTRAINT license_info_license_id_key UNIQUE (license_id);


--
-- Name: license_info license_info_license_key_device_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_info
    ADD CONSTRAINT license_info_license_key_device_id_key UNIQUE (license_key, device_id);


--
-- Name: license_info license_info_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_info
    ADD CONSTRAINT license_info_pkey PRIMARY KEY (id);


--
-- Name: license_logs license_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.license_logs
    ADD CONSTRAINT license_logs_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: purchase_items purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_pkey PRIMARY KEY (purchase_item_id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (purchase_id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (sale_item_id);


--
-- Name: sales sales_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key UNIQUE (invoice_number);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: sub_categories sub_categories_category_id_sub_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_category_id_sub_category_name_key UNIQUE (category_id, sub_category_name);


--
-- Name: sub_categories sub_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_pkey PRIMARY KEY (sub_category_id);


--
-- Name: supplier_payments supplier_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT supplier_payments_pkey PRIMARY KEY (payment_id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (session_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_audit_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_table; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_table ON public.audit_logs USING btree (table_name);


--
-- Name: idx_audit_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_timestamp ON public.audit_logs USING btree ("timestamp");


--
-- Name: idx_audit_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_audit_user_id ON public.audit_logs USING btree (user_id);


--
-- Name: idx_categories_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_status ON public.categories USING btree (status);


--
-- Name: idx_customer_payments_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_payments_customer ON public.customer_payments USING btree (customer_id);


--
-- Name: idx_customer_payments_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customer_payments_date ON public.customer_payments USING btree (payment_date);


--
-- Name: idx_customers_phone; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_phone ON public.customers USING btree (phone);


--
-- Name: idx_customers_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_status ON public.customers USING btree (status);


--
-- Name: idx_customers_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_customers_type ON public.customers USING btree (customer_type);


--
-- Name: idx_expenses_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expenses_category ON public.daily_expenses USING btree (expense_category);


--
-- Name: idx_expenses_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_expenses_date ON public.daily_expenses USING btree (expense_date);


--
-- Name: idx_license_info_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_active ON public.license_info USING btree (is_active);


--
-- Name: idx_license_info_device_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_device_active ON public.license_info USING btree (device_id, is_active) WHERE (is_active = true);


--
-- Name: idx_license_info_device_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_device_id ON public.license_info USING btree (device_id);


--
-- Name: idx_license_info_last_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_last_verified ON public.license_info USING btree (last_verified_at) WHERE (last_verified_at IS NOT NULL);


--
-- Name: idx_license_info_license_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_license_key ON public.license_info USING btree (license_key);


--
-- Name: idx_license_info_pending_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_pending_status ON public.license_info USING btree (pending_status) WHERE (pending_status IS NOT NULL);


--
-- Name: idx_license_info_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_info_status ON public.license_info USING btree (status) WHERE (status IS NOT NULL);


--
-- Name: idx_license_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_logs_created_at ON public.license_logs USING btree (created_at);


--
-- Name: idx_license_logs_license_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_license_logs_license_key ON public.license_logs USING btree (license_key);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (read);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_products_barcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_barcode ON public.products USING btree (barcode);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_category_subcategory; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_category_subcategory ON public.products USING btree (category_id, sub_category_id);


--
-- Name: idx_products_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_display_order ON public.products USING btree (display_order);


--
-- Name: idx_products_frequently_sold; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_frequently_sold ON public.products USING btree (is_frequently_sold) WHERE (is_frequently_sold = true);


--
-- Name: idx_products_sku; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_sku ON public.products USING btree (sku);


--
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_status ON public.products USING btree (status);


--
-- Name: idx_products_sub_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_sub_category ON public.products USING btree (sub_category_id);


--
-- Name: idx_products_supplier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_supplier ON public.products USING btree (supplier_id);


--
-- Name: idx_purchase_items_item; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_items_item ON public.purchase_items USING btree (item_id);


--
-- Name: idx_purchase_items_purchase; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchase_items_purchase ON public.purchase_items USING btree (purchase_id);


--
-- Name: idx_purchases_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchases_product ON public.purchases USING btree (product_id);


--
-- Name: idx_purchases_supplier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_purchases_supplier ON public.purchases USING btree (supplier_id);


--
-- Name: idx_sale_items_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_items_product ON public.sale_items USING btree (product_id);


--
-- Name: idx_sale_items_sale_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sale_items_sale_id ON public.sale_items USING btree (sale_id);


--
-- Name: idx_sales_customer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sales_customer ON public.sales USING btree (customer_id);


--
-- Name: idx_sales_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sales_date ON public.sales USING btree (date);


--
-- Name: idx_sales_invoice_number; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sales_invoice_number ON public.sales USING btree (invoice_number);


--
-- Name: idx_sales_payment_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sales_payment_type ON public.sales USING btree (payment_type);


--
-- Name: idx_sessions_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_expires ON public.user_sessions USING btree (expires_at);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sessions_user_id ON public.user_sessions USING btree (user_id);


--
-- Name: idx_sub_categories_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sub_categories_category ON public.sub_categories USING btree (category_id);


--
-- Name: idx_sub_categories_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sub_categories_status ON public.sub_categories USING btree (status);


--
-- Name: idx_supplier_payments_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_payments_date ON public.supplier_payments USING btree (payment_date);


--
-- Name: idx_supplier_payments_supplier; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_supplier_payments_supplier ON public.supplier_payments USING btree (supplier_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: customer_payments trigger_update_customer_balance_payments; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_customer_balance_payments AFTER INSERT OR DELETE OR UPDATE ON public.customer_payments FOR EACH ROW EXECUTE FUNCTION public.update_customer_balance();


--
-- Name: sales trigger_update_customer_balance_sales; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_customer_balance_sales AFTER INSERT OR DELETE OR UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_customer_balance();


--
-- Name: license_info trigger_update_license_info_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_license_info_updated_at BEFORE UPDATE ON public.license_info FOR EACH ROW EXECUTE FUNCTION public.update_license_info_updated_at();


--
-- Name: supplier_payments trigger_update_supplier_balance_payments; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_supplier_balance_payments AFTER INSERT OR DELETE OR UPDATE ON public.supplier_payments FOR EACH ROW EXECUTE FUNCTION public.update_supplier_balance();


--
-- Name: purchases trigger_update_supplier_balance_purchases; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_supplier_balance_purchases AFTER INSERT OR DELETE OR UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION public.update_supplier_balance();


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: customer_payments customer_payments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_payments
    ADD CONSTRAINT customer_payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE SET NULL;


--
-- Name: products products_sub_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sub_category_id_fkey FOREIGN KEY (sub_category_id) REFERENCES public.sub_categories(sub_category_id) ON DELETE SET NULL;


--
-- Name: products products_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id) ON DELETE SET NULL;


--
-- Name: purchase_items purchase_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.products(product_id);


--
-- Name: purchase_items purchase_items_purchase_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchase_items
    ADD CONSTRAINT purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES public.purchases(purchase_id) ON DELETE CASCADE;


--
-- Name: purchases purchases_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;


--
-- Name: purchases purchases_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- Name: sale_items sale_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON DELETE CASCADE;


--
-- Name: sales sales_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);


--
-- Name: sales sales_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE SET NULL;


--
-- Name: sales sales_finalized_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_finalized_by_fkey FOREIGN KEY (finalized_by) REFERENCES public.users(user_id);


--
-- Name: sales sales_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(user_id);


--
-- Name: sub_categories sub_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sub_categories
    ADD CONSTRAINT sub_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id) ON DELETE CASCADE;


--
-- Name: supplier_payments supplier_payments_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.supplier_payments
    ADD CONSTRAINT supplier_payments_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id) ON DELETE CASCADE;


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 35MmoHhgM1me93Fuw6HhVjWN3ulACZDptpFWeWe7SNAuEs79XSju1ZKil4b9ZAQ

