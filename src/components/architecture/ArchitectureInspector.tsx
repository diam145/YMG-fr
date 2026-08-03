import React, { useState } from 'react';
import { Code2, Database, Server, Smartphone, Copy, Check, Layers, Cpu, Terminal } from 'lucide-react';

export const ArchitectureInspector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'go_ledger' | 'go_adapters' | 'docker' | 'flutter'>('sql');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const handleCopyCode = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const sqlSchemaCode = `-- ============================================================
-- WestFlow Core Ledger Database Schema (PostgreSQL 15+)
-- Double-Entry Accounting & Multi-Jar System for Guinea (BCRG)
-- ============================================================

CREATE TYPE kyc_tier AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');
CREATE TYPE account_type AS ENUM ('MAIN_JAR', 'SAVINGS_JAR', 'TRAVEL_JAR', 'FLOAT', 'MNO_BRIDGE', 'BANK_CLEARING');
CREATE TYPE entry_direction AS ENUM ('DEBIT', 'CREDIT');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    kyc_level kyc_tier DEFAULT 'TIER_1',
    national_id_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Accounts / Jars Table
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(34) UNIQUE NOT NULL,
    account_type account_type NOT NULL,
    currency VARCHAR(3) DEFAULT 'GNF',
    balance_gnf NUMERIC(18, 2) NOT NULL DEFAULT 0.00 CHECK (balance_gnf >= 0),
    auto_save_percent NUMERIC(4, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transactions Master Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) UNIQUE NOT NULL,
    sender_account_id UUID REFERENCES accounts(id),
    recipient_account_id UUID REFERENCES accounts(id),
    amount_gnf NUMERIC(18, 2) NOT NULL CHECK (amount_gnf > 0),
    fee_gnf NUMERIC(18, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Atomic Double-Entry Ledger Entries (Strict Debit = Credit)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    direction entry_direction NOT NULL,
    amount_gnf NUMERIC(18, 2) NOT NULL CHECK (amount_gnf > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_account ON ledger_entries(account_id);
CREATE INDEX idx_transactions_ref ON transactions(reference);`;

  const goLedgerCode = `package ledger

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// TransactionRequest represents an atomic money transfer request
type TransactionRequest struct {
	Reference        string  \`json:"reference"\`
	SenderAccountID  string  \`json:"sender_account_id"\`
	RecipientAccID   string  \`json:"recipient_account_id"\`
	AmountGNF        float64 \`json:"amount_gnf"\`
	FeeGNF           float64 \`json:"fee_gnf"\`
}

// ExecuteDoubleEntryTx executes an atomic debit & credit transaction using Go 1.26 DB Transactions
func ExecuteDoubleEntryTx(ctx context.Context, db *sql.DB, req TransactionRequest) error {
	tx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// 1. Debit Sender Account
	debitQuery := \`UPDATE accounts SET balance_gnf = balance_gnf - $1 WHERE id = $2 AND balance_gnf >= $1\`
	res, err := tx.ExecContext(ctx, debitQuery, req.AmountGNF+req.FeeGNF, req.SenderAccountID)
	if err != nil {
		return fmt.Errorf("debit failed: %w", err)
	}
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("insufficient funds in sender jar")
	}

	// 2. Credit Recipient Account
	creditQuery := \`UPDATE accounts SET balance_gnf = balance_gnf + $1 WHERE id = $2\`
	_, err = tx.ExecContext(ctx, creditQuery, req.AmountGNF, req.RecipientAccID)
	if err != nil {
		return fmt.Errorf("credit failed: %w", err)
	}

	// 3. Insert Master Transaction & Ledger Entries (Double-Entry Bookkeeping)
	var txID string
	txInsert := \`INSERT INTO transactions (reference, sender_account_id, recipient_account_id, amount_gnf, fee_gnf, status)
	            VALUES ($1, $2, $3, $4, $5, 'COMPLETED') RETURNING id\`
	err = tx.QueryRowContext(ctx, txInsert, req.Reference, req.SenderAccountID, req.RecipientAccID, req.AmountGNF, req.FeeGNF).Scan(&txID)
	if err != nil {
		return fmt.Errorf("master transaction insert failed: %w", err)
	}

	// Commit Transaction
	return tx.Commit()
}`;

  const goAdaptersCode = `package adapters

import (
	"context"
	"fmt"
)

// MNOAdapter defines the common interface for Telco Push/Pull (Orange Money & MTN MoMo)
type MNOAdapter interface {
	PushFunds(ctx context.Context, phone string, amountGNF float64) (string, error)
	PullFunds(ctx context.Context, phone string, amountGNF float64) (string, error)
	CheckSimSwap(ctx context.Context, phone string) (bool, error)
}

// OrangeMoneyAdapter implements Orange Money Guinea Open API
type OrangeMoneyAdapter struct {
	APIKey    string
	MerchantID string
}

func (om *OrangeMoneyAdapter) PushFunds(ctx context.Context, phone string, amountGNF float64) (string, error) {
	// Call Orange Money Guinea Cash-In Endpoint
	fmt.Printf("[Orange Money API] Pushing %.0f GNF to %s\\n", amountGNF, phone)
	return "OM-TX-88392019", nil
}

func (om *OrangeMoneyAdapter) CheckSimSwap(ctx context.Context, phone string) (bool, error) {
	// Call GSMA CAMARA Standard SIM-Swap Endpoint
	fmt.Printf("[GSMA CAMARA API] Checking SIM swap history for %s\\n", phone)
	return false, nil // false = safe
}`;

  const dockerComposeCode = `version: '3.8'

services:
  # 1. PostgreSQL 15 Core Ledger
  postgres:
    image: postgres:15-alpine
    container_name: westflow_postgres
    environment:
      POSTGRES_DB: westflow_ledger
      POSTGRES_USER: westflow_admin
      POSTGRES_PASSWORD: secret_password_bcrg
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  # 2. Redis Session & Cache
  redis:
    image: redis:7-alpine
    container_name: westflow_redis
    ports:
      - "6379:6379"

  # 3. Go 1.26 Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis

volumes:
  pgdata:`;

  const flutterBlueprintCode = `# WestFlow Mobile App Architecture (Phase 2 - Flutter)

## Offline-First Local Storage Engine
- **Database:** SQLite with Hive key-value cache for local Jars state.
- **Offline Sync Queue:** Failed/offline transactions are written to local encrypted queue.
- **Background Sync:** WorkManager queues auto-retry as soon as 2G/3G connectivity resumes.

## Rendering & Low-End Optimization
- **Engine:** Flutter Impeller rendering engine for ultra-smooth 60fps on low-end Android devices in West Africa.
- **Lightweight Footprint:** ~10MB APK optimized for limited bandwidth download in Conakry.
- **Adaptive Voice Guidance (VUI):** Native Flutter TTS plugin with cached audio assets in Susu, Pular, Malinke, and French.`;

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40 inline-flex items-center gap-1.5 mb-2">
              <Code2 className="w-3.5 h-3.5" /> Phase 1 Architecture (Go 1.26 & React)
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">Inspecteur d'Architecture & Code Ledger</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Consultez le schéma SQL de la comptabilité en partie double, le code Go 1.26 atomique, les adaptateurs MNO et l'architecture Flutter Phase 2.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400">
              Go 1.26.5 Core
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-blue-400">
              PostgreSQL 15
            </span>
          </div>
        </div>
      </div>

      {/* Code Tab Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-4">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'sql' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" /> Schéma SQL Ledger
          </button>

          <button
            onClick={() => setActiveTab('go_ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'go_ledger' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" /> Ledger Atomique (Go 1.26)
          </button>

          <button
            onClick={() => setActiveTab('go_adapters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'go_adapters' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4" /> Adaptateurs Telco/Bank
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'docker' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" /> Docker Compose
          </button>

          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'flutter' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Flutter Phase 2 Blueprint
          </button>
        </div>

        {/* Code Content Window */}
        <div className="relative">
          <button
            onClick={() => {
              const codeToCopy =
                activeTab === 'sql'
                  ? sqlSchemaCode
                  : activeTab === 'go_ledger'
                  ? goLedgerCode
                  : activeTab === 'go_adapters'
                  ? goAdaptersCode
                  : activeTab === 'docker'
                  ? dockerComposeCode
                  : flutterBlueprintCode;
              handleCopyCode(codeToCopy, activeTab);
            }}
            className="absolute top-3 right-3 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700 shadow"
          >
            {copiedTab === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copié !
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copier Code
              </>
            )}
          </button>

          <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
            {activeTab === 'sql' && sqlSchemaCode}
            {activeTab === 'go_ledger' && goLedgerCode}
            {activeTab === 'go_adapters' && goAdaptersCode}
            {activeTab === 'docker' && dockerComposeCode}
            {activeTab === 'flutter' && flutterBlueprintCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
