# Sockbot-Slack
Slack integration for Sockbot

## Usage
0. Have [sockbot](https://github.com/SockDrawer/Sockbot) installed
1. install using `npm install -g sockbot-slack`
2. Edit your config.yml file like so. Any value will work in the password field, sockbot-slack does not use it but sockbot requires it.

```
core:
  username: [username goes here]
  password: none
  apiToken: [API token here]
  owner: [your nick here]
  provider: sockbot-slack
```

3. Add plugins as per the sockbot instructions
4. Start with `sockbot config.yml`
