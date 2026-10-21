'use strict';
/**
 * validate-prd-data.js — Schema/consistency validator for PRD data files.
 *
 * generate-prd.js is project-agnostic: it just renders whatever data object
 * it's handed. This file is what keeps that safe — it checks a project's
 * prd-data.js against the shape generate-prd.js expects, plus cross-
 * referential sanity checks (unique IDs, dangling references, known enum
 * values, feature/model/test coverage) that a docx build alone would never
 * catch.
 *
 * Usage as a library:
 *   const { validate } = require('./validate-prd-data');
 *   const { valid, errors, warnings } = validate(prdDataObject);
 *
 * Usage as a CLI:
 *   node validate-prd-data.js path/to/prd-data.js
 *   Exit code 0 if valid (warnings allowed), 1 if invalid.
 */

const PRIORITY_VALUES        = ['Low', 'Medium', 'High'];
const RISK_LEVEL_VALUES      = ['Low', 'Medium', 'High'];
const HTTP_METHODS           = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const DATA_OPERATIONS        = ['create', 'read', 'update', 'delete'];
const LOGIC_RULE_TYPES       = ['regex', 'min', 'max', 'enum', 'unique', 'required', 'default', 'limit'];
const BUSINESS_RULE_TYPES    = ['quota', 'role_restriction', 'status_transition', 'approval'];
const CARDINALITY_VALUES     = ['one-to-one', 'one-to-many', 'many-to-one', 'many-to-many'];

// ── helpers ─────────────────────────────────────────────────────
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}
function isNonEmptyArray(v) {
  return Array.isArray(v) && v.length > 0;
}
function findDuplicates(arr) {
  const seen = new Set();
  const dupes = new Set();
  for (const v of arr) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

/**
 * Checks a list of objects for required fields present & non-empty
 * (string or non-empty array), pushing to errors[] with a labelled path.
 */
function checkFields(list, listName, requiredFields, errors, idField = 'id') {
  if (!Array.isArray(list)) return;
  list.forEach((item, i) => {
    const label = item && item[idField] ? `${listName}[${item[idField]}]` : `${listName}[index ${i}]`;
    requiredFields.forEach(f => {
      const val = item?.[f];
      const ok = isNonEmptyString(val) || (Array.isArray(val) && val.length);
      if (!ok) errors.push(`${label}: missing or empty required field "${f}"`);
    });
  });
}

// ── main validator ─────────────────────────────────────────────
function validate(p) {
  const errors = [];
  const warnings = [];

  if (!p || typeof p !== 'object') {
    return { valid: false, errors: ['Data file did not export an object (check module.exports)'], warnings };
  }

  // ── Top-level required sections ────────────────────────────
  const requiredSections = [
    'meta', 'revisions', 'executiveSummary', 'overview', 'assumptions',
    'dependencies', 'risks', 'businessRequirements', 'userFlows',
    'successMetrics', 'functional', 'nonFunctional', 'techStack',
    'architectureDiagram', 'databaseEntities', 'apiEndpoints',
    'securityConsiderations', 'errorHandling', 'testCases', 'appendices',
    // Added in this revision:
    'designSystem', 'frontendConstraints', 'featureSpecs',
    'modelRelationships', 'modelFunctionMap', 'fileMap', 'authFlow',
    'riskMap', 'changeGuide',
  ];
  for (const key of requiredSections) {
    if (!(key in p)) errors.push(`Missing top-level section: "${key}"`);
  }
  // Bail early if core sections are missing — deep checks would just throw.
  if (errors.length) return { valid: false, errors, warnings };

  // ── meta ──────────────────────────────────────────────────
  const metaRequired = ['title', 'subtitle', 'organization', 'project', 'version', 'date', 'preparedBy', 'filename'];
  metaRequired.forEach(f => {
    if (!isNonEmptyString(p.meta?.[f])) errors.push(`meta.${f} is missing or empty`);
  });
  if (p.meta?.filename && /[^a-zA-Z0-9_\-\.]/.test(p.meta.filename)) {
    warnings.push(`meta.filename "${p.meta.filename}" contains characters that may be unsafe in a filesystem path`);
  }

  // ── revisions ─────────────────────────────────────────────
  if (!isNonEmptyArray(p.revisions)) {
    errors.push('revisions must be a non-empty array');
  } else {
    checkFields(p.revisions, 'revisions', ['version', 'date', 'author', 'description'], errors, 'version');
    const lastRev = p.revisions[p.revisions.length - 1];
    if (lastRev && p.meta?.version && lastRev.version !== p.meta.version) {
      warnings.push(`Latest revisions[] entry (v${lastRev.version}) does not match meta.version (v${p.meta.version})`);
    }
  }

  // ── executiveSummary ──────────────────────────────────────
  if (!isNonEmptyArray(p.executiveSummary) || !p.executiveSummary.every(isNonEmptyString)) {
    errors.push('executiveSummary must be a non-empty array of non-empty strings');
  }

  // ── overview ──────────────────────────────────────────────
  const ov = p.overview || {};
  if (!isNonEmptyString(ov.background)) errors.push('overview.background is missing or empty');
  if (!isNonEmptyArray(ov.objectives)) errors.push('overview.objectives must be a non-empty array');
  if (!isNonEmptyString(ov.scope)) errors.push('overview.scope is missing or empty');
  if (!isNonEmptyArray(ov.outOfScope)) errors.push('overview.outOfScope must be a non-empty array');
  if (!isNonEmptyArray(ov.stakeholders)) errors.push('overview.stakeholders must be a non-empty array');

  // ── assumptions / dependencies / risks ───────────────────
  checkFields(p.assumptions, 'assumptions', ['id', 'assumption', 'impact'], errors);
  checkFields(p.dependencies, 'dependencies', ['id', 'dependency', 'owner', 'deadline'], errors);
  checkFields(p.risks, 'risks', ['id', 'risk', 'probability', 'impact', 'level', 'mitigation', 'contingency'], errors);
  (p.risks || []).forEach(r => {
    if (r.probability && !RISK_LEVEL_VALUES.includes(r.probability)) {
      warnings.push(`risks[${r.id}]: probability "${r.probability}" is not one of ${RISK_LEVEL_VALUES.join('/')}`);
    }
    if (r.level && !RISK_LEVEL_VALUES.includes(r.level)) {
      warnings.push(`risks[${r.id}]: level "${r.level}" is not one of ${RISK_LEVEL_VALUES.join('/')}`);
    }
  });

  // ── businessRequirements ─────────────────────────────────
  checkFields(p.businessRequirements, 'businessRequirements', ['id', 'name', 'description', 'stakeholder', 'priority'], errors);
  (p.businessRequirements || []).forEach(br => {
    if (br.priority && !PRIORITY_VALUES.includes(br.priority)) {
      warnings.push(`businessRequirements[${br.id}]: priority "${br.priority}" is not one of ${PRIORITY_VALUES.join('/')}`);
    }
  });
  {
    const dupes = findDuplicates((p.businessRequirements || []).map(b => b.id));
    if (dupes.length) errors.push(`Duplicate businessRequirements IDs: ${dupes.join(', ')}`);
  }

  // ── userFlows ─────────────────────────────────────────────
  checkFields(p.userFlows, 'userFlows', ['name', 'description', 'diagram'], errors, 'name');

  // ── successMetrics ────────────────────────────────────────
  checkFields(p.successMetrics, 'successMetrics', ['metric', 'target', 'tool', 'cadence'], errors, 'metric');

  // ── functional (FR) ───────────────────────────────────────
  checkFields(p.functional, 'functional', ['id', 'name', 'description', 'priority', 'actor'], errors);
  (p.functional || []).forEach(fr => {
    if (!isNonEmptyArray(fr.acceptance)) {
      errors.push(`functional[${fr.id}]: acceptance must be a non-empty array of acceptance criteria`);
    }
    if (fr.priority && !PRIORITY_VALUES.includes(fr.priority)) {
      warnings.push(`functional[${fr.id}]: priority "${fr.priority}" is not one of ${PRIORITY_VALUES.join('/')}`);
    }
  });
  const frIds = (p.functional || []).map(fr => fr.id);
  {
    const dupes = findDuplicates(frIds);
    if (dupes.length) errors.push(`Duplicate functional (FR) IDs: ${dupes.join(', ')}`);
  }

  // ── nonFunctional (NFR) ───────────────────────────────────
  checkFields(p.nonFunctional, 'nonFunctional', ['id', 'name', 'description', 'metric', 'category'], errors);
  const nfrIds = (p.nonFunctional || []).map(nf => nf.id);
  {
    const dupes = findDuplicates(nfrIds);
    if (dupes.length) errors.push(`Duplicate nonFunctional (NFR) IDs: ${dupes.join(', ')}`);
  }

  // ── techStack ─────────────────────────────────────────────
  const ts = p.techStack || {};
  ['backend', 'frontend', 'database', 'devops', 'thirdParty'].forEach(f => {
    if (!isNonEmptyArray(ts[f])) errors.push(`techStack.${f} must be a non-empty array`);
  });

  // ── architectureDiagram ───────────────────────────────────
  if (!isNonEmptyString(p.architectureDiagram)) {
    errors.push('architectureDiagram must be a non-empty string');
  }

  // ── databaseEntities ──────────────────────────────────────
  const dbTableNames = new Set();
  if (!isNonEmptyArray(p.databaseEntities)) {
    errors.push('databaseEntities must be a non-empty array');
  } else {
    p.databaseEntities.forEach(entity => {
      if (!isNonEmptyString(entity.table)) {
        errors.push('databaseEntities[]: an entity is missing "table" name');
        return;
      }
      dbTableNames.add(entity.table);
      if (!isNonEmptyArray(entity.columns)) {
        errors.push(`databaseEntities[${entity.table}]: columns must be a non-empty array`);
        return;
      }
      entity.columns.forEach((c, i) => {
        ['name', 'type', 'constraints'].forEach(f => {
          if (!isNonEmptyString(c[f])) {
            errors.push(`databaseEntities[${entity.table}].columns[${i}]: missing "${f}"`);
          }
        });
        if (c.notes === undefined || c.notes === null) {
          errors.push(`databaseEntities[${entity.table}].columns[${i}]: "notes" must be present (can be empty string)`);
        }
      });
      const hasPK = entity.columns.some(c => /PK/i.test(c.constraints || ''));
      if (!hasPK) warnings.push(`databaseEntities[${entity.table}]: no column marked as primary key (PK) in constraints`);
    });
  }

  // ── designSystem ──────────────────────────────────────────
  const ds = p.designSystem || {};
  if (!isNonEmptyString(ds.styleDirection)) errors.push('designSystem.styleDirection is missing or empty');
  if (!isNonEmptyArray(ds.typography)) {
    errors.push('designSystem.typography must be a non-empty array');
  } else {
    checkFields(ds.typography, 'designSystem.typography', ['name', 'fontFamily', 'size', 'weight', 'usage'], errors, 'name');
  }
  if (!isNonEmptyArray(ds.colorPalette)) {
    errors.push('designSystem.colorPalette must be a non-empty array');
  } else {
    checkFields(ds.colorPalette, 'designSystem.colorPalette', ['name', 'hex', 'usage'], errors, 'name');
    ds.colorPalette.forEach(c => {
      if (c.hex && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(c.hex)) {
        warnings.push(`designSystem.colorPalette[${c.name}]: hex "${c.hex}" does not look like a valid hex color`);
      }
    });
  }
  if (!isNonEmptyArray(ds.cssTokens)) {
    errors.push('designSystem.cssTokens must be a non-empty array');
  } else {
    checkFields(ds.cssTokens, 'designSystem.cssTokens', ['token', 'value', 'usage'], errors, 'token');
  }

  // ── frontendConstraints ───────────────────────────────────
  const fc = p.frontendConstraints || {};
  if (!isNonEmptyString(fc.stylingApproach)) errors.push('frontendConstraints.stylingApproach is missing or empty');
  if (typeof fc.noInlineStyling !== 'boolean') {
    errors.push('frontendConstraints.noInlineStyling must be a boolean (true = inline/class-heavy styling is prohibited)');
  } else if (fc.noInlineStyling === false) {
    warnings.push('frontendConstraints.noInlineStyling is false — inline/class-heavy styling is not prohibited for this project; confirm this is intentional');
  }
  if (!isNonEmptyArray(fc.prohibitions)) errors.push('frontendConstraints.prohibitions must be a non-empty array');
  if (!isNonEmptyArray(fc.tokenRules)) errors.push('frontendConstraints.tokenRules must be a non-empty array');

  // ── featureSpecs ──────────────────────────────────────────
  const featureIds = new Set();
  if (!isNonEmptyArray(p.featureSpecs)) {
    errors.push('featureSpecs must be a non-empty array');
  } else {
    p.featureSpecs.forEach((fs, i) => {
      const label = fs.id ? `featureSpecs[${fs.id}]` : `featureSpecs[index ${i}]`;
      if (!isNonEmptyString(fs.id)) {
        errors.push(`${label}: missing "id"`);
        return;
      }
      featureIds.add(fs.id);
      if (!isNonEmptyString(fs.name)) errors.push(`${label}: missing "name"`);

      const df = fs.dataFlow || {};
      ['actor', 'trigger', 'input', 'process', 'output', 'stateChange'].forEach(f => {
        if (!isNonEmptyString(df[f])) errors.push(`${label}.dataFlow.${f} is missing or empty`);
      });

      if (!isNonEmptyArray(fs.dataStore)) {
        errors.push(`${label}.dataStore must be a non-empty array`);
      } else {
        fs.dataStore.forEach((entry, j) => {
          if (!isNonEmptyString(entry.model)) {
            errors.push(`${label}.dataStore[${j}]: missing "model"`);
          } else if (dbTableNames.size && !dbTableNames.has(entry.model)) {
            errors.push(`${label}.dataStore[${j}]: model "${entry.model}" does not match any databaseEntities[].table`);
          }
          if (!isNonEmptyArray(entry.operations)) {
            errors.push(`${label}.dataStore[${j}]: operations must be a non-empty array`);
          } else {
            entry.operations.forEach(op => {
              if (!DATA_OPERATIONS.includes(op)) {
                warnings.push(`${label}.dataStore[${j}]: operation "${op}" is not one of ${DATA_OPERATIONS.join('/')}`);
              }
            });
          }
        });
      }

      if (!Array.isArray(fs.logicRules)) {
        errors.push(`${label}.logicRules must be an array (can be empty if the feature has no field-level rules)`);
      } else {
        fs.logicRules.forEach((lr, j) => {
          if (!isNonEmptyString(lr.field)) errors.push(`${label}.logicRules[${j}]: missing "field"`);
          if (!isNonEmptyString(lr.rule)) {
            errors.push(`${label}.logicRules[${j}]: missing "rule"`);
          } else if (!LOGIC_RULE_TYPES.includes(lr.rule)) {
            warnings.push(`${label}.logicRules[${j}]: rule type "${lr.rule}" is not one of ${LOGIC_RULE_TYPES.join('/')}`);
          }
        });
      }

      if (!Array.isArray(fs.businessRules)) {
        errors.push(`${label}.businessRules must be an array (can be empty if the feature has no business rules)`);
      } else {
        fs.businessRules.forEach((br, j) => {
          if (!isNonEmptyString(br.type)) {
            errors.push(`${label}.businessRules[${j}]: missing "type"`);
          } else if (!BUSINESS_RULE_TYPES.includes(br.type)) {
            warnings.push(`${label}.businessRules[${j}]: type "${br.type}" is not one of ${BUSINESS_RULE_TYPES.join('/')}`);
          }
          if (!isNonEmptyString(br.description)) errors.push(`${label}.businessRules[${j}]: missing "description"`);
        });
      }

      const ui = fs.uiStates || {};
      ['loading', 'empty', 'error', 'disabled', 'success'].forEach(f => {
        if (!isNonEmptyString(ui[f])) errors.push(`${label}.uiStates.${f} is missing or empty`);
      });
    });

    const dupeFeatureIds = findDuplicates(p.featureSpecs.map(f => f.id));
    if (dupeFeatureIds.length) errors.push(`Duplicate featureSpecs IDs: ${dupeFeatureIds.join(', ')}`);
  }

  // Every FR must have a corresponding featureSpecs entry.
  frIds.forEach(id => {
    if (!featureIds.has(id)) {
      errors.push(`functional[${id}]: no corresponding featureSpecs entry — every FR must link to a featureSpecs.id`);
    }
  });

  // ── modelRelationships ────────────────────────────────────
  const modelNames = new Set(dbTableNames);
  if (!isNonEmptyArray(p.modelRelationships)) {
    errors.push('modelRelationships must be a non-empty array');
  } else {
    p.modelRelationships.forEach((mr, i) => {
      const label = mr.model ? `modelRelationships[${mr.model}]` : `modelRelationships[index ${i}]`;
      ['model', 'relation', 'cardinality', 'fk', 'ownership'].forEach(f => {
        if (!isNonEmptyString(mr[f])) errors.push(`${label}: missing or empty "${f}"`);
      });
      if (mr.model && dbTableNames.size && !dbTableNames.has(mr.model)) {
        warnings.push(`${label}: model "${mr.model}" does not match any databaseEntities[].table`);
      }
      if (mr.cardinality && !CARDINALITY_VALUES.includes(mr.cardinality)) {
        warnings.push(`${label}: cardinality "${mr.cardinality}" is not one of ${CARDINALITY_VALUES.join('/')}`);
      }
      if (mr.model) modelNames.add(mr.model);
    });
  }

  // ── modelFunctionMap ──────────────────────────────────────
  if (!isNonEmptyArray(p.modelFunctionMap)) {
    errors.push('modelFunctionMap must be a non-empty array');
  } else {
    checkFields(p.modelFunctionMap, 'modelFunctionMap', ['function', 'purpose', 'params', 'paramSource', 'sourceModel', 'return', 'sideEffect'], errors, 'function');
    p.modelFunctionMap.forEach(mf => {
      if (mf.sourceModel && modelNames.size && !modelNames.has(mf.sourceModel)) {
        errors.push(`modelFunctionMap[${mf.function}]: sourceModel "${mf.sourceModel}" does not match any databaseEntities[].table or modelRelationships[].model`);
      }
    });
  }

  // ── fileMap ───────────────────────────────────────────────
  if (!isNonEmptyArray(p.fileMap)) {
    errors.push('fileMap must be a non-empty array');
  } else {
    checkFields(p.fileMap, 'fileMap', ['feature', 'route', 'controller', 'service', 'model', 'schema', 'component', 'test'], errors, 'feature');
    p.fileMap.forEach(fm => {
      if (fm.feature && featureIds.size && !featureIds.has(fm.feature)) {
        warnings.push(`fileMap[${fm.feature}]: feature "${fm.feature}" does not match any featureSpecs[].id`);
      }
    });
  }

  // ── authFlow ──────────────────────────────────────────────
  const af = p.authFlow || {};
  if (!isNonEmptyString(af.login)) errors.push('authFlow.login is missing or empty');
  if (!isNonEmptyString(af.sessionLifecycle)) errors.push('authFlow.sessionLifecycle is missing or empty');
  if (!isNonEmptyArray(af.roles)) errors.push('authFlow.roles must be a non-empty array');
  if (!isNonEmptyArray(af.permissions)) {
    errors.push('authFlow.permissions must be a non-empty array');
  } else {
    af.permissions.forEach((perm, i) => {
      if (!isNonEmptyString(perm.role)) errors.push(`authFlow.permissions[${i}]: missing "role"`);
      else if (isNonEmptyArray(af.roles) && !af.roles.includes(perm.role)) {
        warnings.push(`authFlow.permissions[${i}]: role "${perm.role}" is not listed in authFlow.roles`);
      }
      if (!isNonEmptyArray(perm.permissions)) errors.push(`authFlow.permissions[${i}]: permissions must be a non-empty array`);
    });
  }
  if (!isNonEmptyArray(af.protectedRoutes)) errors.push('authFlow.protectedRoutes must be a non-empty array');
  if (!isNonEmptyArray(af.failStates)) errors.push('authFlow.failStates must be a non-empty array');

  // ── apiEndpoints ──────────────────────────────────────────
  checkFields(p.apiEndpoints, 'apiEndpoints', ['method', 'endpoint', 'auth', 'description', 'request', 'response', 'relatedFeature', 'relatedModel'], errors, 'endpoint');
  (p.apiEndpoints || []).forEach(ep => {
    if (ep.method && !HTTP_METHODS.includes(ep.method)) {
      errors.push(`apiEndpoints[${ep.endpoint}]: method "${ep.method}" is not a valid HTTP method`);
    }
    if (ep.endpoint && !ep.endpoint.startsWith('/')) {
      warnings.push(`apiEndpoints[${ep.endpoint}]: endpoint path should start with "/"`);
    }
    if (ep.relatedFeature && featureIds.size && !featureIds.has(ep.relatedFeature)) {
      warnings.push(`apiEndpoints[${ep.endpoint}]: relatedFeature "${ep.relatedFeature}" does not match any featureSpecs[].id`);
    }
    if (ep.relatedModel && dbTableNames.size && !dbTableNames.has(ep.relatedModel)) {
      warnings.push(`apiEndpoints[${ep.endpoint}]: relatedModel "${ep.relatedModel}" does not match any databaseEntities[].table`);
    }
    if (ep.auth && ep.auth !== 'Public' && isNonEmptyArray(af.roles) && !af.roles.includes(ep.auth)) {
      warnings.push(`apiEndpoints[${ep.endpoint}]: auth "${ep.auth}" is not "Public" and does not match any authFlow.roles`);
    }
  });

  // ── securityConsiderations / errorHandling ───────────────
  checkFields(p.securityConsiderations, 'securityConsiderations', ['area', 'approach', 'implementation'], errors, 'area');
  checkFields(p.errorHandling, 'errorHandling', ['layer', 'strategy', 'userBehavior'], errors, 'layer');

  // ── testCases ─────────────────────────────────────────────
  checkFields(p.testCases, 'testCases', ['tcId', 'requirement', 'testCase', 'steps', 'expected', 'priority'], errors, 'tcId');
  {
    const dupes = findDuplicates((p.testCases || []).map(tc => tc.tcId));
    if (dupes.length) errors.push(`Duplicate testCases IDs: ${dupes.join(', ')}`);
  }
  const knownReqIds = new Set([...frIds, ...nfrIds]);
  (p.testCases || []).forEach(tc => {
    if (tc.requirement && !knownReqIds.has(tc.requirement)) {
      warnings.push(`testCases[${tc.tcId}]: requirement "${tc.requirement}" does not match any functional/nonFunctional ID`);
    }
    if (tc.priority && !PRIORITY_VALUES.includes(tc.priority)) {
      warnings.push(`testCases[${tc.tcId}]: priority "${tc.priority}" is not one of ${PRIORITY_VALUES.join('/')}`);
    }
  });
  const testedReqs = new Set((p.testCases || []).map(tc => tc.requirement));
  // FR coverage
  frIds.forEach(id => {
    if (!testedReqs.has(id)) warnings.push(`functional[${id}]: has no corresponding entry in testCases`);
  });
  // NFR coverage
  nfrIds.forEach(id => {
    if (!testedReqs.has(id)) warnings.push(`nonFunctional[${id}]: has no corresponding entry in testCases`);
  });
  // Feature logic coverage: features with logic/business rules should be tested
  (p.featureSpecs || []).forEach(fs => {
    const hasLogic = (fs.logicRules && fs.logicRules.length) || (fs.businessRules && fs.businessRules.length);
    if (hasLogic && fs.id && !testedReqs.has(fs.id)) {
      warnings.push(`featureSpecs[${fs.id}]: has logic/business rules but no corresponding entry in testCases`);
    }
  });

  // ── riskMap ───────────────────────────────────────────────
  if (!isNonEmptyArray(p.riskMap)) {
    errors.push('riskMap must be a non-empty array');
  } else {
    checkFields(p.riskMap, 'riskMap', ['area', 'cause', 'impact', 'likelihood', 'mitigation', 'owner'], errors, 'area');
    p.riskMap.forEach(r => {
      if (r.likelihood && !RISK_LEVEL_VALUES.includes(r.likelihood)) {
        warnings.push(`riskMap[${r.area}]: likelihood "${r.likelihood}" is not one of ${RISK_LEVEL_VALUES.join('/')}`);
      }
    });
  }

  // ── changeGuide ───────────────────────────────────────────
  if (!isNonEmptyArray(p.changeGuide)) {
    errors.push('changeGuide must be a non-empty array');
  } else {
    p.changeGuide.forEach((cg, i) => {
      const label = cg.title ? `changeGuide[${cg.title}]` : `changeGuide[index ${i}]`;
      if (!isNonEmptyString(cg.title)) errors.push(`${label}: missing "title"`);
      if (!isNonEmptyArray(cg.changedFiles)) errors.push(`${label}.changedFiles must be a non-empty array`);
      ['migrationImpact', 'configImpact', 'compatibility', 'rollback'].forEach(f => {
        if (!isNonEmptyString(cg[f])) errors.push(`${label}.${f} is missing or empty`);
      });
    });
  }

  // ── appendices.glossary ──────────────────────────────────
  if (!p.appendices || !isNonEmptyArray(p.appendices.glossary)) {
    errors.push('appendices.glossary must be a non-empty array');
  } else {
    checkFields(p.appendices.glossary, 'appendices.glossary', ['term', 'def'], errors, 'term');
    const dupes = findDuplicates(p.appendices.glossary.map(g => g.term));
    if (dupes.length) warnings.push(`Duplicate glossary terms: ${dupes.join(', ')}`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ── CLI entry point ────────────────────────────────────────────
if (require.main === module) {
  const path = require('path');
  const fs = require('fs');

  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node validate-prd-data.js path/to/prd-data.js');
    process.exit(1);
  }

  const dataPath = path.resolve(process.cwd(), arg);
  if (!fs.existsSync(dataPath)) {
    console.error(`❌  Data file not found: ${dataPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = require(dataPath);
  } catch (err) {
    console.error(`❌  Failed to load data file: ${err.message}`);
    process.exit(1);
  }

  const { valid, errors, warnings } = validate(data);

  console.log(`\nValidating: ${dataPath}\n`);

  if (warnings.length) {
    console.log(`⚠️  ${warnings.length} warning(s):`);
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  if (errors.length) {
    console.log(`❌  ${errors.length} error(s):`);
    errors.forEach(err => console.log(`   - ${err}`));
    console.log('');
  }

  if (valid) {
    console.log('✅  Data is valid' + (warnings.length ? ' (with warnings above).' : '.'));
    process.exit(0);
  } else {
    console.log('❌  Data is INVALID — fix the errors above before running generate-prd.js.');
    process.exit(1);
  }
}

module.exports = { validate };
