# Brunei Map generated from Survey Department's Data

- Created as part of [Brunei Geek Meet](http://bruneigeekmeet.com)'s data hackathon http://www.meetup.com/BruneiGeekMeet/events/229707511/

## Source Data
- Source: http://survey.gov.bn/web/survey_department/map
- Saved as a text file from a manual search
- Network request
http://survey.gov.bn/alpha2//getFeatures.do?srs=29873&maxFeatures=-1&filterIds=%3A%3Asa%3A%3Ab8ee99b50af09a0b0ef194e7cb9c32c3&featureName=MUKIMS_P_FINAL&featureNameSpace=http%3A%2F%2Fwww.erdas.com%2Fwfs&serverUrl=http%3A%2F%2Fsurvey.gov.bn%3A80%2Ferdas-apollo%2Fvector%2FMUKIMS&sourceType=FeatureServer&twoDimensional=true&outputFormat=json

- Changed to `srs` from `29873` to `4326` to prevent the need of conversions
http://survey.gov.bn/alpha2//getFeatures.do?srs=4326&maxFeatures=-1&filterIds=%3A%3Asa%3A%3Ab8ee99b50af09a0b0ef194e7cb9c32c3&featureName=MUKIMS_P_FINAL&featureNameSpace=http%3A%2F%2Fwww.erdas.com%2Fwfs&serverUrl=http%3A%2F%2Fsurvey.gov.bn%3A80%2Ferdas-apollo%2Fvector%2FMUKIMS&sourceType=FeatureServer&twoDimensional=true&outputFormat=json

- Data parsed with the parse/parse.js node script and saved to a [GeoJSON](http://geojson.org/) format

## Webapp
- Allows viewing of Mukims and Kampongs with ability to search