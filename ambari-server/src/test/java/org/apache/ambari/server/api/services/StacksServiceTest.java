/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ambari.server.api.services;

import org.apache.ambari.server.api.resources.ResourceInstance;
import org.apache.ambari.server.api.services.parsers.RequestBodyParser;
import org.apache.ambari.server.api.services.serializers.ResultSerializer;
import org.easymock.EasyMock;

import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.UriInfo;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;


import static org.easymock.EasyMock.expect;
import static org.easymock.EasyMock.notNull;
import static org.easymock.EasyMock.same;
import static org.junit.Assert.assertEquals;

/**
* Unit tests for StacksService.
*/
public class StacksServiceTest extends BaseServiceTest {

  @Override
  public List<ServiceTestInvocation> getTestInvocations() throws Exception {
    List<ServiceTestInvocation> listInvocations = new ArrayList<ServiceTestInvocation>();

    // getStack
    StacksService service = new TestStacksService("stackName", null);
    Method m = service.getClass().getMethod("getStack", String.class, HttpHeaders.class, UriInfo.class, String.class);
    Object[] args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    //getStacks
    service = new TestStacksService(null, null);
    m = service.getClass().getMethod("getStacks", String.class, HttpHeaders.class, UriInfo.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo()};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getStackVersion
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getStackVersion", String.class, HttpHeaders.class, UriInfo.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getStackVersions
    service = new TestStacksService("stackName", null);
    m = service.getClass().getMethod("getStackVersions", String.class, HttpHeaders.class, UriInfo.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getRepository
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getRepository", String.class, HttpHeaders.class, UriInfo.class, String.class,
        String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "os", "repo-id"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getRepositories
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getRepositories", String.class, HttpHeaders.class, UriInfo.class, String.class,
        String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "os"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // updateRepository
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("updateRepository", String.class, HttpHeaders.class, UriInfo.class, String.class,
        String.class, String.class, String.class);
    args = new Object[] {"body", getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "os", "repo-id"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.PUT, service, m, args, "body"));

    // getStackService
    service = new TestStacksService("stackName", null);
    m = service.getClass().getMethod("getStackService", String.class, HttpHeaders.class, UriInfo.class, String.class,
        String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "service-name"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getStackServices
    service = new TestStacksService("stackName", null);
    m = service.getClass().getMethod("getStackServices", String.class, HttpHeaders.class, UriInfo.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getStackConfiguration
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getStackConfiguration", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "service-name", "property-name"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getStackConfigurations
    service = new TestStacksService("stackName", null);
    m = service.getClass().getMethod("getStackConfigurations", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "service-name"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getServiceComponent
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getServiceComponent", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "service-name", "component-name"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getServiceComponents
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getServiceComponents", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "service-name"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getOperationSystem
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getOperatingSystem", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion", "os-type"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    // getOperationSystems
    service = new TestStacksService("stackName", "stackVersion");
    m = service.getClass().getMethod("getOperatingSystems", String.class, HttpHeaders.class, UriInfo.class,
        String.class, String.class);
    args = new Object[] {null, getHttpHeaders(), getUriInfo(), "stackName", "stackVersion"};
    listInvocations.add(new ServiceTestInvocation(Request.Type.GET, service, m, args, null));

    return listInvocations;
  }

  private class TestStacksService extends StacksService {

    private String m_stackId;
    private String m_stackVersion;

    private TestStacksService(String stackName, String stackVersion) {
      m_stackId = stackName;
      m_stackVersion = stackVersion;
    }

    @Override
    ResourceInstance createStackResource(String stackName) {
      assertEquals(m_stackId, stackName);
      return getTestResource();
    }

    @Override
    ResourceInstance createStackVersionResource(String stackName, String stackVersion) {
      assertEquals(m_stackId, stackName);
      assertEquals(m_stackVersion, stackVersion);
      return getTestResource();
    }

    @Override
    ResourceInstance createRepositoryResource(String stackName,
        String stackVersion, String osType, String repoId) {
      return getTestResource();
    }

    @Override
    ResourceInstance createStackServiceResource(String stackName,
        String stackVersion, String serviceName) {
      return getTestResource();
    }

    ResourceInstance createStackConfigurationResource(String stackName,
        String stackVersion, String serviceName, String propertyName) {
      return getTestResource();
    }

    ResourceInstance createStackServiceComponentResource(String stackName,
        String stackVersion, String serviceName, String componentName) {
      return getTestResource();
    }

    ResourceInstance createOperatingSystemResource(String stackName,
        String stackVersion, String osType) {
      return getTestResource();
    }


    @Override
    RequestFactory getRequestFactory() {
      return getTestRequestFactory();
    }

    @Override
    protected RequestBodyParser getBodyParser() {
      return getTestBodyParser();
    }

    @Override
    protected ResultSerializer getResultSerializer() {
      return getTestResultSerializer();
    }
  }

  //todo: this is necessary for temporary changes to service to support both stacks and stacks2 api.
  //todo: when stacks2 is removed and stacks doesn't need to wrap the UriInfo, this should be removed.
  @Override
  protected void assertCreateRequest(ServiceTestInvocation testMethod) {
    expect(requestFactory.createRequest(same(httpHeaders), same(requestBody), (UriInfo) notNull(),
        same(testMethod.getRequestType()), same(resourceInstance))).andReturn(request);
  }
}
