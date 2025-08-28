# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## run web/client
.PHONY: web
run/web:
	@npm run dev --prefix web   # TAB here

# format
format:
	@npm run format --prefix web && npm run format --prefix api

.PHONY: api
run/api:
	@npm run dev --prefix api

.PHONY: install
install/all:
	@npm install --prefix web --legacy-peer-deps && npm install --prefix api

install/web:
	@npm install --prefix web --legacy-peer-deps

install/api:
	@npm install --prefix api
