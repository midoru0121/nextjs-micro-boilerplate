lego --accept-tos \
  --http \
  --http.webroot "${CERT_WEB_ROOT}" \
  --path "${CERT_PATH}" \
  --email ${CERT_EMAIL} \
  --domains "${CERT_DOMAIN}" \
  --domains "api.${CERT_DOMAIN}" \
  renew --days 45