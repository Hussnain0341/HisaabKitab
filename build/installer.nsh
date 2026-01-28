; ============================================
; HISAABKITAB NSIS INSTALLER SCRIPT
; ============================================
; This script runs automatically during installation to:
; 1. Silently install PostgreSQL (if bundled)
; 2. Run database setup automatically
; ============================================

!include "LogicLib.nsh"

!macro customInstall
  DetailPrint "============================================"
  DetailPrint "HisaabKitab: Setting up database..."
  DetailPrint "============================================"

  ; Step 1: Check if PostgreSQL installer is bundled
  DetailPrint "Checking for bundled PostgreSQL installer..."

  ; Try PostgreSQL 15.x first
  StrCpy $0 "$INSTDIR\resources\postgres\postgresql-15.5-windows-x64.exe"
  ${If} ${FileExists} "$0"
    DetailPrint "Found PostgreSQL 15.x installer, running silent install..."
    DetailPrint "This may take a few minutes..."
    Goto RunPostgresInstaller
  ${EndIf}

  ; Try PostgreSQL 16.x
  StrCpy $0 "$INSTDIR\resources\postgres\postgresql-16.1-windows-x64.exe"
  ${If} ${FileExists} "$0"
    DetailPrint "Found PostgreSQL 16.x installer, running silent install..."
    DetailPrint "This may take a few minutes..."
    Goto RunPostgresInstaller
  ${EndIf}

  ; PostgreSQL installer not found
  DetailPrint "PostgreSQL installer not found. Assuming PostgreSQL is already installed."
  Goto SkipPostgresInstall

  RunPostgresInstaller:
    ; Run PostgreSQL installer in unattended mode
    nsExec::ExecToLog '"$0" --mode unattended --unattendedmodeui none --superpassword "postgres" --servicename "postgresql-x64-15" --serverport 5432 --disable-components stackbuilder'
    Pop $1

    ${If} $1 == 0
      DetailPrint "PostgreSQL installed successfully!"
      DetailPrint "Starting PostgreSQL service..."
      Sleep 2000
      nsExec::ExecToLog 'net start postgresql-x64-15'
      Pop $2
    ${Else}
      DetailPrint "Warning: PostgreSQL installer returned exit code $1"
      DetailPrint "PostgreSQL may already be installed, or installation may have failed."
    ${EndIf}

  SkipPostgresInstall:
  ; Step 2: Wait for PostgreSQL to be ready
  DetailPrint "Waiting for PostgreSQL to be ready..."
  Sleep 3000

  ; Step 3: Run database setup automatically
  DetailPrint "Running HisaabKitab database setup..."
  DetailPrint "This will create the database and all tables automatically..."
  nsExec::ExecToLog '"$INSTDIR\HisaabKitab.exe" --setup-db-auto'
  Pop $3

  ${If} $3 == 0
    DetailPrint "Database setup completed successfully!"
    DetailPrint "All tables, columns, indexes, and default data have been created."
  ${Else}
    DetailPrint "Database setup returned exit code $3"
    DetailPrint "If the database already existed, this may be normal."
    DetailPrint "The application will verify database setup on first launch."
  ${EndIf}

  DetailPrint "============================================"
  DetailPrint "HisaabKitab installation completed!"
  DetailPrint "============================================"
!macroend

!macro customUnInstall
  DetailPrint "HisaabKitab: Uninstalling (leaving PostgreSQL and data intact)..."
  DetailPrint "Note: PostgreSQL and database files are preserved for data safety."
!macroend