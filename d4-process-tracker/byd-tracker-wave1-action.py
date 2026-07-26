#!/usr/bin/env python3
"""
byd-tracker-wave1-action.py
Popula o D4 com as ações concretas da Wave 1 do backlog-operacional.md.
Executar: uv run --no-project --python 3.12 python byd-tracker-wave1-action.py
"""
import sqlite3, uuid, datetime, json, os
from pathlib import Path

DB = Path(__file__).parent / "byd-tracker.db"

WAVE1 = [
    ("BYD",          "Business Specialist Camacari",  "linkedin_message", "Yueying Zhang",  "T0_lean", "byd-yueying-t0",       "CRITICA"),
    ("BYD",          "Especialista de Dados Campinas","easy_apply",       None,             "T0_lean", "byd-especialista-app", "ALTA"),
    ("BYD",          "After-sale Efficiency Dev",     "easy_apply",      None,             "T0_lean", "byd-aftersale-app",    "ALTA"),
    ("FullStack Labs","Data Engineer Remote",        "linkedin_message", "Recrutador tech","T1_polite","fsl-linkedin-t1",    "MEDIA"),
    ("BairesDev",    "Analista de Dados Remote",      "email",            "careers@bairesdev.com","T3_email","bairesdev-email-t3","MEDIA"),
    ("Jobbol",       "Analista Dados Senior Salvador","easy_apply",       None,             "T0_lean", "jobbol-app",           "MEDIA"),
    ("INDI Staffing","Talent Data Analyst Remote",     "linkedin_message", "Recrutador INDI","T1_polite","indi-linkedin-t1",  "MEDIA"),
    ("EY",           "Engenheiro IA Pleno Salvador",  "easy_apply",       None,             "T0_lean", "ey-app",               "ALTA"),
    ("Alignerr",     "SW Engineer AI Training",        "easy_apply",       None,             "T0_lean", "alignerr-app",         "BAIXA"),
]

TEMPLATES = {
    "byd-yueying-t0": (
        "Olá Yueying, vi a vaga Business Specialist em Camaçari. "
        "Tenho 3 anos em análise quantitativa (Python/Polars) + "
        "contexto directo do Polo. Posso agregar imediatamente na "
        "gestão de BOM e análisis de variance. Estou em Salvador, "
        "50km de Camaçari. Posso compartilhar 1-pager? "
        "[D2: PTAX vol 14.2%, HHI battery 4850, regime calmo]"
    ),
    "byd-especialista-app": "[Easy Apply] BYD Especialista Dados Campinas. Python/SQL/BI.",
    "byd-aftersale-app": "[Easy Apply] BYD After-sale Efficiency Dev. Python + data-driven systems.",
    "fsl-linkedin-t1": (
        "Olá! Vi a vaga Data Engineer Remote. Sou Matheus, Salvador-BA, "
        "trabalho com Python/Polars + pipelines (DuckDB). "
        "Posso contribuir no time de Salvador. "
        "Posso compartilhar 1-pager quant? Abraço."
    ),
    "bairesdev-email-t3": (
        "Assunto: Analista de Dados Remote — Matheus, Salvador-BA\n\n"
        "Prezados, vi a vaga. Sou Matheus, trabalho com Python/Polars + "
        "análise quantitativa. Remote-first + fit técnico = match. "
        "1-pager de stress test BRL/USD em anexo. Disp. para interview."
    ),
    "jobbol-app": "[Easy Apply] Analista Dados Sênior Salvador. Python + data analysis.",
    "indi-linkedin-t1": (
        "Olá! Vi a vaga Talent Data Analyst Remote na INDI. "
        "Sou Matheus, Salvador-BA, Python + análise quant. "
        "Remoto + quant = match. Posso compartilhar 1-pager BYD? 15 min?"
    ),
    "ey-app": "[Easy Apply] Engenheiro IA Pleno Salvador. Python + ML + análise quant.",
    "alignerr-app": "[Easy Apply] SW Engineer AI Training. Python + ML básico + data quality.",
}

def new_ueid(kind: str) -> str:
    u = uuid.uuid4().hex[:8]
    h = uuid.uuid4().hex[:8]
    return f"ikigai:{kind}:{u}:{h}"

def already_in_db(conn, company, vaga):
    row = conn.execute(
        "SELECT 1 FROM process WHERE company=? AND vaga=?", (company, vaga)
    ).fetchone()
    return row is not None

def main():
    conn = sqlite3.connect(DB)
    now_utc = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    planned = skipped = 0

    print("=== WAVE 1 PLANNING ===")
    for company, vaga, channel, manager, persona, tpl, priority in WAVE1:
        if already_in_db(conn, company, vaga):
            print(f"  SKIP  {priority} | {company} | {vaga} — already in tracker")
            skipped += 1
            continue

        p_id  = new_ueid("process")
        o_id  = new_ueid("outreach")
        next_action = f"ENVIAR {channel} [{priority}] — {vaga} via {tpl}"
        msg_body = TEMPLATES.get(tpl, f"[{priority}] {vaga} — {company}")

        conn.execute("""
            INSERT INTO process
              (process_id, company, vaga, stage, stage_entered_at,
               next_action, created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?)
        """, (p_id, company, vaga, "discovered", now_utc,
              next_action, now_utc, now_utc))

        conn.execute("""
            INSERT INTO outreach
              (outreach_id, sent_at, company, vaga, channel, manager_name,
               persona_used, template_id, message_body,
               created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """, (o_id, now_utc, company, vaga, channel, manager,
              persona, tpl, msg_body, now_utc, now_utc))

        # Log decision
        d_id = new_ueid("decision")
        conn.execute("""
            INSERT INTO decision_log
              (decision_id, decided_at, question, options_json, chosen_option,
               rationale, created_at)
            VALUES (?,?,?,?,?,?,?)
        """, (
            d_id, now_utc,
            f"[WAVE1] Plan outreach for {company}/{vaga}",
            json.dumps([f"{channel}:{tpl}" for _,_,ch,_,_,t,_ in WAVE1]),
            f"{channel} via {tpl} [{priority}]",
            f"Wave 1 planned {priority} priority. Template={tpl}. Persona={persona}.",
            now_utc
        ))
        print(f"  PLAN   {priority:6} | {company:15} | {vaga:35} | {channel}")
        planned += 1

    conn.commit()
    print(f"\n=== DONE ===")
    print(f"Planned: {planned} | Skipped (already in DB): {skipped}")
    print(f"\nCanary limits:")
    print(f"  LinkedIn connections: ≤5/day (free tier)")
    print(f"  Emails: ≤2/day per company")
    print(f"  ≥2 working days between messages to same person")
    print(f"\nNext: execute each PLAN row and log response in tracker.")

if __name__ == "__main__":
    main()
