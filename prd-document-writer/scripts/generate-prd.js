'use strict';
/**
 * generate-prd.js — Product Requirements Document Generator (GENERIC)
 * Requires: ../../_shared/docx-engine.js  (shared engine)
 * Requires: ./validate-prd-data.js        (data validation, run before build)
 *
 * This file contains ONLY the document builder. It has no knowledge of any
 * specific project — all project content (Sitiwinangun, CORELASI, etc.)
 * lives in a separate data file that exports a PRD object matching the
 * schema documented in validate-prd-data.js / prd-data.template.js.
 *
 * Expected folder layout:
 *   <root>/_shared/docx-engine.js
 *   <root>/projects/<project-name>/generate-prd.js   (this file)
 *   <root>/projects/<project-name>/validate-prd-data.js
 *   <root>/projects/<project-name>/prd-data.js       (project-specific data)
 *
 * Usage:
 *   node generate-prd.js [path/to/prd-data.js]
 *   (defaults to ./prd-data.js if no path is given)
 *
 * Sections built (independent of project content):
 *  Cover / Revision History / TOC
 *  1. Executive Summary
 *  2. Project Overview (+ Assumptions/Dependencies, Risks & Mitigation, Risk Map)
 *  3. Business Requirements
 *  4. User Flows
 *  5. Success Metrics
 *  6. Functional Requirements (summary table + per-FR detail)
 *  7. Feature Specifications (overview)
 *  8. Data Flow per Feature
 *  9. Data Store per Feature
 *  10. Validation & Logic Rules
 *  11. Non-Functional Requirements
 *  12. Technical Specifications (Tech Stack, Architecture, DB Entities, API Endpoints)
 *  13. Data Model Relationships
 *  14. Model Function Map
 *  15. File Map
 *  16. Frontend Styling Constraints (Design System + Constraints)
 *  17. Security Considerations
 *  18. Auth Flow
 *  19. Error Handling Strategy
 *  20. Test Plan
 *  21. Change Guide
 *  22. Appendices
 */

const e    = require('../../_shared/docx-engine');
const fs   = require('fs');
const path = require('path');
const { validate } = require('./validate-prd-data');

// ─────────────────────────────────────────────────────────────────
// LOAD PROJECT DATA
// ─────────────────────────────────────────────────────────────────
const dataArg  = process.argv[2] || './prd-data.js';
const dataPath = path.resolve(process.cwd(), dataArg);

if (!fs.existsSync(dataPath)) {
  console.error(`❌  Data file not found: ${dataPath}`);
  console.error(`    Usage: node generate-prd.js [path/to/prd-data.js]`);
  process.exit(1);
}

let PRD;
try {
  PRD = require(dataPath);
} catch (err) {
  console.error(`❌  Failed to load data file: ${err.message}`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────
// VALIDATE PROJECT DATA BEFORE BUILDING
// ─────────────────────────────────────────────────────────────────
const { valid, errors, warnings } = validate(PRD);

if (warnings.length) {
  console.warn(`⚠️  ${warnings.length} warning(s):`);
  warnings.forEach(w => console.warn(`   - ${w}`));
}

if (!valid) {
  console.error(`❌  ${errors.length} error(s) — fix before generating:`);
  errors.forEach(err => console.error(`   - ${err}`));
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────
// BUILDER
// ─────────────────────────────────────────────────────────────────
function build(p) {
  const CW = e.DXA.CONTENT_W;   // total content width, resolved per-run
  const b = [];

  // ── Front matter ──────────────────────────────────────────────
  b.push(...e.cover(p.meta));
  b.push(...e.revisionHistory(p.revisions));
  b.push(...e.tocSection());

  // ── 1. Executive Summary ──────────────────────────────────────
  b.push(e.h(0, 'Executive Summary'));
  for (const para of p.executiveSummary) b.push(e.p(para), e.sp());

  // ── 2. Project Overview ───────────────────────────────────────
  b.push(e.h(0, 'Project Overview'));
  b.push(e.h(1, 'Background'));
  b.push(e.p(p.overview.background), e.sp());

  b.push(e.h(1, 'Objectives'));
  for (const o of p.overview.objectives) b.push(e.bullet(o));
  b.push(e.sp());

  b.push(e.h(1, 'Scope'));
  b.push(e.p(p.overview.scope), e.sp());

  b.push(e.h(1, 'Out of Scope'));
  for (const o of p.overview.outOfScope) b.push(e.bullet(o));
  b.push(e.sp());

  b.push(e.h(1, 'Stakeholders'));
  for (const s of p.overview.stakeholders) b.push(e.bullet(s));
  b.push(e.sp());

  b.push(e.h(1, 'Assumptions & Dependencies'));
  b.push(e.h(2, 'Assumptions'));
  b.push(e.tblCaption('Project Assumptions'));
  b.push(e.tbl({
    headers    : ['ID', 'Assumption', 'Impact'],
    rows       : p.assumptions.map(a => [a.id, a.assumption, a.impact]),
    columnDefs : [
      { w: 900,             align: 'center' },
      { w: CW - 900 - 2626,  align: 'left'   },
      { w: 2626,             align: 'left'   },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(2, 'Dependencies'));
  b.push(e.tblCaption('Project Dependencies'));
  b.push(e.tbl({
    headers    : ['ID', 'Dependency', 'Owner', 'Deadline'],
    rows       : p.dependencies.map(d => [d.id, d.dependency, d.owner, d.deadline]),
    columnDefs : [
      { w: 900,  align: 'center' },
      { w: 3400, align: 'left'   },
      { w: 2226, align: 'left'   },
      { w: CW - 900 - 3400 - 2226, align: 'center' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Risks & Mitigation'));
  b.push(e.tblCaption('Project Risks and Mitigation'));
  b.push(e.tbl({
    headers    : ['ID', 'Risk', 'Prob.', 'Impact', 'Level', 'Mitigation', 'Contingency'],
    rows       : p.risks.map(r => [r.id, r.risk, r.probability, r.impact, r.level, r.mitigation, r.contingency]),
    columnDefs : [
      { w: 800,  align: 'center' },
      { w: 1400, align: 'left'   },
      { w: 800,  align: 'center' },
      { w: 800,  align: 'center' },
      { w: 800,  align: 'center' },
      { w: 1900, align: 'left'   },
      { w: CW - 800 - 1400 - 800 - 800 - 800 - 1900, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Risk Map (Feature / System Area)'));
  b.push(e.tblCaption('Risk Map per Feature / Area'));
  b.push(e.tbl({
    headers    : ['Area', 'Cause', 'Impact', 'Likelihood', 'Mitigation', 'Owner'],
    rows       : p.riskMap.map(r => [r.area, r.cause, r.impact, r.likelihood, r.mitigation, r.owner]),
    columnDefs : [
      { w: 1400, align: 'left'   },
      { w: 1600, align: 'left'   },
      { w: 1200, align: 'center' },
      { w: 1200, align: 'center' },
      { w: 1800, align: 'left'   },
      { w: CW - 1400 - 1600 - 1200 - 1200 - 1800, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 3. Business Requirements ──────────────────────────────────
  b.push(e.h(0, 'Business Requirements'));
  b.push(e.tblCaption('Business Requirements List'));
  b.push(e.tbl({
    headers    : ['ID', 'Name', 'Description', 'Stakeholder', 'Priority'],
    rows       : p.businessRequirements.map(br => [br.id, br.name, br.description, br.stakeholder, br.priority]),
    columnDefs : [
      { w: 1000, align: 'center' },
      { w: 1800, align: 'left'   },
      { w: 3500, align: 'left'   },
      { w: 1400, align: 'left'   },
      { w: CW - 1000 - 1800 - 3500 - 1400, align: 'center' },
    ],
  }));
  b.push(e.sp());

  // ── 4. User Flows ─────────────────────────────────────────────
  b.push(e.h(0, 'User Flows'));
  b.push(e.p('The following describes the primary user interaction flows with the platform.'));
  b.push(e.sp());

  for (const flow of p.userFlows) {
    b.push(e.h(1, flow.name));
    b.push(e.p(flow.description));
    b.push(e.sp());
    b.push(e.tbl({
      headers    : [`Flow Diagram — ${flow.name}`],
      rows       : [[flow.diagram]],
      columnDefs : [{ w: CW, align: 'left' }],
    }));
    b.push(e.sp());
  }

  // ── 5. Success Metrics ────────────────────────────────────────
  b.push(e.h(0, 'Success Metrics'));
  b.push(e.tblCaption('Platform Success Metrics'));
  b.push(e.tbl({
    headers    : ['Metric', 'Target', 'Measurement Tool', 'Cadence'],
    rows       : p.successMetrics.map(m => [m.metric, m.target, m.tool, m.cadence]),
    columnDefs : [
      { w: 2600, align: 'left'   },
      { w: 2200, align: 'left'   },
      { w: 2200, align: 'left'   },
      { w: CW - 2600 - 2200 - 2200, align: 'center' },
    ],
  }));
  b.push(e.sp());

  // ── 6. Functional Requirements ────────────────────────────────
  b.push(e.h(0, 'Functional Requirements'));

  b.push(e.h(1, 'FR Summary'));
  b.push(e.tblCaption('Functional Requirements Summary'));
  b.push(e.tbl({
    headers    : ['ID', 'Name', 'Description', 'Priority', 'Actor'],
    rows       : p.functional.map(fr => [fr.id, fr.name, fr.description, fr.priority, fr.actor]),
    columnDefs : [
      { w: 1000, align: 'center' },
      { w: 1600, align: 'left'   },
      { w: 3600, align: 'left'   },
      { w: 1100, align: 'center' },
      { w: CW - 1000 - 1600 - 3600 - 1100, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'FR Detail'));
  for (const fr of p.functional) {
    b.push(e.h(2, `${fr.id}: ${fr.name}`));
    b.push(e.tblCaption(`Detail ${fr.id} — ${fr.name}`));
    b.push(e.tbl({
      headers    : ['Attribute', 'Detail'],
      rows       : [
        ['ID',          fr.id          ],
        ['Name',        fr.name        ],
        ['Description', fr.description ],
        ['Priority',    fr.priority    ],
        ['Actor',       fr.actor       ],
      ],
      columnDefs : [
        { w: 2000, align: 'left' },
        { w: CW - 2000, align: 'left' },
      ],
    }));
    b.push(e.sp());
    b.push(e.p('Acceptance Criteria:', { bold: true }));
    fr.acceptance.forEach((ac, i) => b.push(e.p(`${i + 1}. ${ac}`)));
    b.push(e.sp());
  }

  // ── 7. Feature Specifications ─────────────────────────────────
  b.push(e.h(0, 'Feature Specifications'));
  b.push(e.p('Every functional requirement above is backed by a detailed feature specification, expanded across the following sections (Data Flow, Data Store, Validation & Logic Rules).'));
  b.push(e.sp());
  b.push(e.tblCaption('Feature Specification Overview'));
  b.push(e.tbl({
    headers    : ['ID', 'Feature Name'],
    rows       : p.featureSpecs.map(fsItem => [fsItem.id, fsItem.name]),
    columnDefs : [
      { w: 1400, align: 'center' },
      { w: CW - 1400, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 8. Data Flow per Feature ───────────────────────────────────
  b.push(e.h(0, 'Data Flow per Feature'));
  for (const fsItem of p.featureSpecs) {
    b.push(e.h(1, `${fsItem.id}: ${fsItem.name}`));
    b.push(e.tblCaption(`Data Flow — ${fsItem.id}`));
    b.push(e.tbl({
      headers    : ['Actor', 'Trigger', 'Input', 'Process', 'Output', 'State Change'],
      rows       : [[
        fsItem.dataFlow.actor, fsItem.dataFlow.trigger, fsItem.dataFlow.input,
        fsItem.dataFlow.process, fsItem.dataFlow.output, fsItem.dataFlow.stateChange,
      ]],
      columnDefs : [
        { w: 1100, align: 'left' },
        { w: 1300, align: 'left' },
        { w: 1300, align: 'left' },
        { w: 1900, align: 'left' },
        { w: 1500, align: 'left' },
        { w: CW - 1100 - 1300 - 1300 - 1900 - 1500, align: 'left' },
      ],
    }));
    b.push(e.sp());
  }

  // ── 9. Data Store per Feature ──────────────────────────────────
  b.push(e.h(0, 'Data Store per Feature'));
  for (const fsItem of p.featureSpecs) {
    b.push(e.h(1, `${fsItem.id}: ${fsItem.name}`));
    b.push(e.tblCaption(`Data Store — ${fsItem.id}`));
    b.push(e.tbl({
      headers    : ['Model / Table', 'Operations'],
      rows       : fsItem.dataStore.map(dsEntry => [dsEntry.model, dsEntry.operations.join(', ')]),
      columnDefs : [
        { w: 2600, align: 'left' },
        { w: CW - 2600, align: 'left' },
      ],
    }));
    b.push(e.sp());
  }

  // ── 10. Validation & Logic Rules ───────────────────────────────
  b.push(e.h(0, 'Validation & Logic Rules'));
  for (const fsItem of p.featureSpecs) {
    b.push(e.h(1, `${fsItem.id}: ${fsItem.name}`));

    if (fsItem.logicRules && fsItem.logicRules.length) {
      b.push(e.p('Field-level Logic Rules:', { bold: true }));
      b.push(e.tblCaption(`Logic Rules — ${fsItem.id}`));
      b.push(e.tbl({
        headers    : ['Field', 'Rule', 'Value'],
        rows       : fsItem.logicRules.map(lr => [lr.field, lr.rule, lr.value || '-']),
        columnDefs : [
          { w: 2200, align: 'left'   },
          { w: 1600, align: 'center' },
          { w: CW - 2200 - 1600, align: 'left' },
        ],
      }));
      b.push(e.sp());
    }

    if (fsItem.businessRules && fsItem.businessRules.length) {
      b.push(e.p('Business Rules:', { bold: true }));
      b.push(e.tblCaption(`Business Rules — ${fsItem.id}`));
      b.push(e.tbl({
        headers    : ['Type', 'Description'],
        rows       : fsItem.businessRules.map(br => [br.type, br.description]),
        columnDefs : [
          { w: 2000, align: 'center' },
          { w: CW - 2000, align: 'left' },
        ],
      }));
      b.push(e.sp());
    }

    b.push(e.p('UI States:', { bold: true }));
    b.push(e.tblCaption(`UI States — ${fsItem.id}`));
    b.push(e.tbl({
      headers    : ['Loading', 'Empty', 'Error', 'Disabled', 'Success'],
      rows       : [[
        fsItem.uiStates.loading, fsItem.uiStates.empty, fsItem.uiStates.error,
        fsItem.uiStates.disabled, fsItem.uiStates.success,
      ]],
      columnDefs : [
        { w: Math.floor(CW / 5), align: 'left' },
        { w: Math.floor(CW / 5), align: 'left' },
        { w: Math.floor(CW / 5), align: 'left' },
        { w: Math.floor(CW / 5), align: 'left' },
        { w: CW - 4 * Math.floor(CW / 5), align: 'left' },
      ],
    }));
    b.push(e.sp());
  }

  // ── 11. Non-Functional Requirements ───────────────────────────
  b.push(e.h(0, 'Non-Functional Requirements'));
  b.push(e.tblCaption('Non-Functional Requirements List'));
  b.push(e.tbl({
    headers    : ['ID', 'Name', 'Category', 'Description', 'Metric / Target'],
    rows       : p.nonFunctional.map(nf => [nf.id, nf.name, nf.category, nf.description, nf.metric]),
    columnDefs : [
      { w: 1000, align: 'center' },
      { w: 1400, align: 'left'   },
      { w: 1600, align: 'left'   },
      { w: 2400, align: 'left'   },
      { w: CW - 1000 - 1400 - 1600 - 2400, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 12. Technical Specifications ──────────────────────────────
  b.push(e.h(0, 'Technical Specifications'));

  b.push(e.h(1, 'Tech Stack'));
  b.push(e.tblCaption('Technology Stack'));
  b.push(e.tbl({
    headers    : ['Layer', 'Technology'],
    rows       : [
      ['Backend',     p.techStack.backend.join(', ')    ],
      ['Frontend',    p.techStack.frontend.join(', ')   ],
      ['Database',    p.techStack.database.join(', ')   ],
      ['DevOps',      p.techStack.devops.join(', ')     ],
      ['Third-party', p.techStack.thirdParty.join(', ') ],
    ],
    columnDefs : [
      { w: 2000, align: 'left' },
      { w: CW - 2000, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Architecture Diagram'));
  b.push(e.p('High-level system architecture:'));
  b.push(e.sp());
  b.push(e.tbl({
    headers    : ['Architecture — High Level'],
    rows       : [[p.architectureDiagram]],
    columnDefs : [{ w: CW, align: 'left' }],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Database Entities'));
  for (const entity of p.databaseEntities) {
    b.push(e.h(2, `Table: ${entity.table}`));
    b.push(e.tblCaption(`Table Structure: ${entity.table}`));
    b.push(e.tbl({
      headers    : ['Column', 'Type', 'Constraints', 'Notes'],
      rows       : entity.columns.map(c => [c.name, c.type, c.constraints, c.notes]),
      columnDefs : [
        { w: 1800, align: 'left'   },
        { w: 2400, align: 'left'   },
        { w: 2400, align: 'left'   },
        { w: CW - 1800 - 2400 - 2400, align: 'left' },
      ],
    }));
    if (entity.indexes && entity.indexes.length) {
      b.push(e.p('Indexes:', { bold: true }));
      for (const idx of entity.indexes) b.push(e.bullet(idx));
    }
    b.push(e.sp());
  }

  b.push(e.h(1, 'API Endpoints'));
  b.push(e.tblCaption('API Endpoints List'));
  b.push(e.tbl({
    headers    : ['Method', 'Endpoint', 'Auth', 'Description', 'Related Feature', 'Related Model'],
    rows       : p.apiEndpoints.map(ep => [ep.method, ep.endpoint, ep.auth, ep.description, ep.relatedFeature, ep.relatedModel]),
    columnDefs : [
      { w: 800,  align: 'center' },
      { w: 2000, align: 'left'   },
      { w: 900,  align: 'center' },
      { w: 2500, align: 'left'   },
      { w: 1200, align: 'center' },
      { w: CW - 800 - 2000 - 900 - 2500 - 1200, align: 'center' },
    ],
  }));
  b.push(e.sp());
  b.push(e.tblCaption('API Request / Response Examples'));
  b.push(e.tbl({
    headers    : ['Endpoint', 'Example Request', 'Example Response'],
    rows       : p.apiEndpoints.map(ep => [ep.endpoint, ep.request, ep.response]),
    columnDefs : [
      { w: 2000, align: 'left' },
      { w: 3000, align: 'left' },
      { w: CW - 2000 - 3000, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 13. Data Model Relationships ──────────────────────────────
  b.push(e.h(0, 'Data Model Relationships'));
  b.push(e.tblCaption('Model Relationships'));
  b.push(e.tbl({
    headers    : ['Model', 'Relation', 'Cardinality', 'Foreign Key', 'Ownership'],
    rows       : p.modelRelationships.map(mr => [mr.model, mr.relation, mr.cardinality, mr.fk, mr.ownership]),
    columnDefs : [
      { w: 1400, align: 'left'   },
      { w: 2000, align: 'left'   },
      { w: 1400, align: 'center' },
      { w: 1800, align: 'left'   },
      { w: CW - 1400 - 2000 - 1400 - 1800, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 14. Model Function Map ────────────────────────────────────
  b.push(e.h(0, 'Model Function Map'));
  b.push(e.tblCaption('Model Function Map'));
  b.push(e.tbl({
    headers    : ['Function', 'Purpose', 'Params', 'Param Source', 'Source Model', 'Return', 'Side Effect'],
    rows       : p.modelFunctionMap.map(mf => [mf.function, mf.purpose, mf.params, mf.paramSource, mf.sourceModel, mf.return, mf.sideEffect]),
    columnDefs : [
      { w: 1400, align: 'left' },
      { w: 1600, align: 'left' },
      { w: 1400, align: 'left' },
      { w: 1200, align: 'left' },
      { w: 1200, align: 'left' },
      { w: 1200, align: 'left' },
      { w: CW - 1400 - 1600 - 1400 - 1200 - 1200 - 1200, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 15. File Map ───────────────────────────────────────────────
  b.push(e.h(0, 'File Map'));
  b.push(e.tblCaption('File Map per Feature'));
  b.push(e.tbl({
    headers    : ['Feature', 'Route', 'Controller', 'Service', 'Model', 'Schema/Migration', 'Component/View', 'Test'],
    rows       : p.fileMap.map(fm => [fm.feature, fm.route, fm.controller, fm.service, fm.model, fm.schema, fm.component, fm.test]),
    columnDefs : [
      { w: 900,  align: 'center' },
      { w: 1300, align: 'left'   },
      { w: 1300, align: 'left'   },
      { w: 1200, align: 'left'   },
      { w: 1000, align: 'left'   },
      { w: 1300, align: 'left'   },
      { w: 1300, align: 'left'   },
      { w: CW - 900 - 1300 - 1300 - 1200 - 1000 - 1300 - 1300, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 16. Frontend Styling Constraints ──────────────────────────
  b.push(e.h(0, 'Frontend Styling Constraints'));

  b.push(e.h(1, 'Design System'));
  b.push(e.p(p.designSystem.styleDirection));
  b.push(e.sp());

  b.push(e.h(2, 'Typography'));
  b.push(e.tblCaption('Typography Scale'));
  b.push(e.tbl({
    headers    : ['Name', 'Font Family', 'Size', 'Weight', 'Usage'],
    rows       : p.designSystem.typography.map(t => [t.name, t.fontFamily, t.size, t.weight, t.usage]),
    columnDefs : [
      { w: 1400, align: 'left' },
      { w: 2200, align: 'left' },
      { w: 1000, align: 'center' },
      { w: 1200, align: 'center' },
      { w: CW - 1400 - 2200 - 1000 - 1200, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(2, 'Color Palette'));
  b.push(e.tblCaption('Color Palette'));
  b.push(e.tbl({
    headers    : ['Name', 'Hex', 'Usage'],
    rows       : p.designSystem.colorPalette.map(c => [c.name, c.hex, c.usage]),
    columnDefs : [
      { w: 1800, align: 'left'   },
      { w: 1400, align: 'center' },
      { w: CW - 1800 - 1400, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(2, 'CSS Tokens'));
  b.push(e.tblCaption('CSS Design Tokens'));
  b.push(e.tbl({
    headers    : ['Token', 'Value', 'Usage'],
    rows       : p.designSystem.cssTokens.map(t => [t.token, t.value, t.usage]),
    columnDefs : [
      { w: 2200, align: 'left' },
      { w: 2200, align: 'left' },
      { w: CW - 2200 - 2200, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Frontend Constraints'));
  b.push(e.p(`Styling Approach: ${p.frontendConstraints.stylingApproach}`, { bold: true }));
  b.push(e.p(`No Inline / Class-Heavy Styling Enforced: ${p.frontendConstraints.noInlineStyling ? 'Yes' : 'No'}`));
  b.push(e.sp());

  b.push(e.p('Prohibitions:', { bold: true }));
  for (const prohibition of p.frontendConstraints.prohibitions) b.push(e.bullet(prohibition));
  b.push(e.sp());

  b.push(e.p('Token / CSS / Module Rules:', { bold: true }));
  for (const rule of p.frontendConstraints.tokenRules) b.push(e.bullet(rule));
  b.push(e.sp());

  // ── 17. Security Considerations ───────────────────────────────
  b.push(e.h(0, 'Security Considerations'));
  b.push(e.tblCaption('System Security Considerations'));
  b.push(e.tbl({
    headers    : ['Area', 'Approach', 'Implementation'],
    rows       : p.securityConsiderations.map(s => [s.area, s.approach, s.implementation]),
    columnDefs : [
      { w: 1800, align: 'left' },
      { w: 2400, align: 'left' },
      { w: CW - 1800 - 2400, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 18. Auth Flow ──────────────────────────────────────────────
  b.push(e.h(0, 'Auth Flow'));

  b.push(e.h(1, 'Login & Session'));
  b.push(e.p(p.authFlow.login));
  b.push(e.sp());
  b.push(e.p('Session / Token Lifecycle:', { bold: true }));
  b.push(e.p(p.authFlow.sessionLifecycle));
  b.push(e.sp());

  b.push(e.h(1, 'Roles & Permissions'));
  b.push(e.tblCaption('Roles and Permissions Matrix'));
  b.push(e.tbl({
    headers    : ['Role', 'Permissions'],
    rows       : p.authFlow.permissions.map(perm => [perm.role, perm.permissions.join(', ')]),
    columnDefs : [
      { w: 2000, align: 'left' },
      { w: CW - 2000, align: 'left' },
    ],
  }));
  b.push(e.sp());

  b.push(e.h(1, 'Protected Routes'));
  for (const route of p.authFlow.protectedRoutes) b.push(e.bullet(route));
  b.push(e.sp());

  b.push(e.h(1, 'Failure States'));
  for (const failState of p.authFlow.failStates) b.push(e.bullet(failState));
  b.push(e.sp());

  // ── 19. Error Handling Strategy ───────────────────────────────
  b.push(e.h(0, 'Error Handling Strategy'));
  b.push(e.tblCaption('Error Handling Strategy by Layer'));
  b.push(e.tbl({
    headers    : ['Layer', 'Strategy', 'User-facing Behavior'],
    rows       : p.errorHandling.map(eh => [eh.layer, eh.strategy, eh.userBehavior]),
    columnDefs : [
      { w: 2000, align: 'left' },
      { w: 2800, align: 'left' },
      { w: CW - 2000 - 2800, align: 'left' },
    ],
  }));
  b.push(e.sp());

  // ── 20. Test Plan ──────────────────────────────────────────────
  b.push(e.h(0, 'Test Plan'));

  b.push(e.h(1, 'Test Scope'));
  b.push(e.p(p.testScope || 'Testing covers: Functional Testing, Non-Functional Testing (Performance & Usability), and Regression Testing after bug-fixes.'));
  b.push(e.sp());

  b.push(e.h(1, 'Test Cases'));
  b.push(e.tblCaption('Test Case List'));
  b.push(e.tbl({
    headers    : ['TC ID', 'Requirement', 'Test Case', 'Steps', 'Expected Result', 'Priority'],
    rows       : p.testCases.map(tc => [tc.tcId, tc.requirement, tc.testCase, tc.steps, tc.expected, tc.priority]),
    columnDefs : [
      { w: 900,  align: 'center' },
      { w: 1100, align: 'center' },
      { w: 1800, align: 'left'   },
      { w: 2000, align: 'left'   },
      { w: 2000, align: 'left'   },
      { w: CW - 900 - 1100 - 1800 - 2000 - 2000, align: 'center' },
    ],
  }));
  b.push(e.sp());

  // ── 21. Change Guide ───────────────────────────────────────────
  b.push(e.h(0, 'Change Guide'));
  for (const cg of p.changeGuide) {
    b.push(e.h(1, cg.title));
    b.push(e.p('Changed Files:', { bold: true }));
    for (const file of cg.changedFiles) b.push(e.bullet(file));
    b.push(e.sp());
    b.push(e.tblCaption(`Impact Summary — ${cg.title}`));
    b.push(e.tbl({
      headers    : ['Migration Impact', 'Config Impact', 'Compatibility', 'Rollback Plan'],
      rows       : [[cg.migrationImpact, cg.configImpact, cg.compatibility, cg.rollback]],
      columnDefs : [
        { w: Math.floor(CW / 4), align: 'left' },
        { w: Math.floor(CW / 4), align: 'left' },
        { w: Math.floor(CW / 4), align: 'left' },
        { w: CW - 3 * Math.floor(CW / 4), align: 'left' },
      ],
    }));
    b.push(e.sp());
  }

  // ── 22. Appendices ────────────────────────────────────────────
  b.push(e.h(0, 'Appendices'));
  b.push(e.h(1, 'Glossary'));
  b.push(e.tblCaption('Term Glossary'));
  b.push(e.tbl({
    headers    : ['Term', 'Definition'],
    rows       : p.appendices.glossary.map(g => [g.term, g.def]),
    columnDefs : [
      { w: 2400, align: 'left' },
      { w: CW - 2400, align: 'left' },
    ],
  }));

  return e.assemble(p.meta, b);
}

// ─────────────────────────────────────────────────────────────────
// SAVE
// ─────────────────────────────────────────────────────────────────
const OUT = '/mnt/user-data/outputs';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let doc;
try {
  // e.assemble() is SYNCHRONOUS in docx-engine.js — it returns a Document
  // directly, not a Promise. Only e.save() is async (it awaits Packer.toBuffer).
  doc = build(PRD);
} catch (err) {
  console.error('❌  Build error:', err.message);
  process.exit(1);
}

e.save(doc, path.join(OUT, `${PRD.meta.filename}.docx`))
  .then(() => console.log(`✅  Generated: ${PRD.meta.filename}.docx`))
  .catch(err => { console.error('❌  Save error:', err.message); process.exit(1); });
