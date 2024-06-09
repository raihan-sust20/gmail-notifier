#!/bin/bash

IS_ACTIVE=$(sudo systemctl is-active email-notifier.service);

if [[ IS_ACTIVE == 'active' ]]; then
  echo "Email notifier service is active, stopping now...";
  sudo systemctl stop email-notifier.service;
  echo "Stopped"
fi;

# npm run build;

WORKING_DIRECTORY=$(pwd);
NODE_BIN_DIR=$(which node);
WHO_AM_I=$(whoami);

sed "s|<absolute-path-to-project-direcotory>|${WORKING_DIRECTORY}|g" email-notifier.service.sample > email-notifier.service;
sed -i "s|<node_bin_directory>|${NODE_BIN_DIR}|g" email-notifier.service;
sed -i "s|<who_am_i>|${WHO_AM_I}|g" email-notifier.service;

sudo cp -f email-notifier.service /etc/systemd/system/;

IS_ENABLED=$(sudo systemctl is-enabled email-notifier.service);

if [[ ! ${IS_ENABLED} == 'enabled' ]]; then
  echo "Email notifier service is disabled, activating now...";
  sudo systemctl enable email-notifier.service;
  echo "Service activated";
fi

sudo systemctl daemon-reload;

sudo systemctl start email-notifier.service

echo "Will wait for 30 sec to check service status";
sleep 30s;

sudo systemctl status email-notifier.service