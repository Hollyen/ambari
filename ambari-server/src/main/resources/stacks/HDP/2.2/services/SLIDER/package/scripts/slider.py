"""
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Ambari Agent

"""
import os

from resource_management import *


def slider():
  import params

  Directory(params.slider_conf_dir,
            recursive=True
  )

  XmlConfig("slider-client.xml",
            conf_dir=params.slider_conf_dir,
            configurations=params.config['configurations']['slider-client']
  )

  File(format("{slider_conf_dir}/slider-env.sh"),
       mode=0755,
       content=Template('slider-env.sh.j2')
  )

  if (params.log4j_props != None):
    File(format("{params.slider_conf_dir}/log4j.properties"),
         mode=0644,
         content=params.log4j_props
    )
  elif (os.path.exists(format("{params.slider_conf_dir}/log4j.properties"))):
    File(format("{params.slider_conf_dir}/log4j.properties"),
         mode=0644
    )
