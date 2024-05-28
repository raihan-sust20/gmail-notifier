#!/bin/bash

WORKING_DIRECTORY=$(pwd);

sed "s|<absolute-path-to-project-direcotory>|${WORKING_DIRECTORY}|g" email-notifier.service.sample > email-notifier.service

if [[ ! -d ~/.config/systemd/user ]]; then
  echo "~/.config/systemd/user does not exist. Creating now..."
  mkdir -p ~/.config/systemd/user;
fi

cp -f email-notifier.service ~/.config/systemd/user/;

IS_ENABLED=$(systemctl --user is-enabled email-notifier.service);

if [[ ! ${IS_ENABLED} == 'enabled' ]]; then
  # systemctl --user enable email_notifier.service
  # systemctl --user daemon-reload
  echo "Service not ebaled, enabling service now...";
fi

# systemctl --user start email-notifier.service
