import ace from 'ace-builds'

import langSqlServerUrl from 'ace-builds/src-noconflict/mode-sqlserver?url'
ace.config.setModuleUrl('ace/mode/sqlserver', langSqlServerUrl)

import langSqlUrl from 'ace-builds/src-noconflict/mode-sql?url'
ace.config.setModuleUrl('ace/mode/sql', langSqlUrl)

import langYaml from 'ace-builds/src-noconflict/mode-yaml?url'
ace.config.setModuleUrl('ace/mode/yaml', langYaml)

import themeUrl from 'ace-builds/src-noconflict/theme-clouds?url'
ace.config.setModuleUrl('ace/theme/clouds', themeUrl)

import themeChromeUrl from 'ace-builds/src-noconflict/theme-chrome?url'
ace.config.setModuleUrl('ace/theme/chrome', themeChromeUrl)

import workerBaseUrl from 'ace-builds/src-noconflict/worker-base?url'
ace.config.setModuleUrl('ace/mode/base', workerBaseUrl)

import workerYamlUrl from 'ace-builds/src-noconflict/worker-yaml?url'
ace.config.setModuleUrl('ace/mode/yaml_worker', workerYamlUrl)

import 'ace-builds/src-noconflict/ext-language_tools'
ace.require("ace/ext/language_tools")