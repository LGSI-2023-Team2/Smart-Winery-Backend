---
description: Route to '/wine/'
---

# /

GET:

{% swagger method="get" path="/wine/" baseUrl="http://13.48.52.200:3000" summary="get wine data" %}
{% swagger-description %}
should return data of wine
{% endswagger-description %}

{% swagger-parameter in="query" name="windid" type="ObjectId" required="true" %}
id of wine to be added
{% endswagger-parameter %}
{% endswagger %}
