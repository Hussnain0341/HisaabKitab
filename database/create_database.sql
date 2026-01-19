-- Create Database Script for HisaabKitab
-- Run this as PostgreSQL superuser (postgres user)

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE hisaabkitab'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'hisaabkitab')\gexec

-- Connect to the new database and run init.sql
-- Note: After running this, connect to 'hisaabkitab' database and run init.sql

