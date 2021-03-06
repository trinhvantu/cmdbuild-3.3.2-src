
package org.cmdbuild.services.soap.client.beans;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for getCardListExt complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="getCardListExt"&gt;
 *   &lt;complexContent&gt;
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType"&gt;
 *       &lt;sequence&gt;
 *         &lt;element name="className" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="attributeList" type="{http://soap.services.cmdbuild.org}attribute" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="queryType" type="{http://soap.services.cmdbuild.org}query" minOccurs="0"/&gt;
 *         &lt;element name="orderType" type="{http://soap.services.cmdbuild.org}order" maxOccurs="unbounded" minOccurs="0"/&gt;
 *         &lt;element name="limit" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/&gt;
 *         &lt;element name="offset" type="{http://www.w3.org/2001/XMLSchema}int" minOccurs="0"/&gt;
 *         &lt;element name="fullTextQuery" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/&gt;
 *         &lt;element name="cqlQuery" type="{http://soap.services.cmdbuild.org}cqlQuery" minOccurs="0"/&gt;
 *       &lt;/sequence&gt;
 *     &lt;/restriction&gt;
 *   &lt;/complexContent&gt;
 * &lt;/complexType&gt;
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "getCardListExt", propOrder = {
    "className",
    "attributeList",
    "queryType",
    "orderType",
    "limit",
    "offset",
    "fullTextQuery",
    "cqlQuery"
})
public class GetCardListExt {

    protected String className;
    protected List<Attribute> attributeList;
    protected Query queryType;
    protected List<Order> orderType;
    protected Long limit;
    protected Long offset;
    protected String fullTextQuery;
    protected CqlQuery cqlQuery;

    /**
     * Gets the value of the className property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getClassName() {
        return className;
    }

    /**
     * Sets the value of the className property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setClassName(String value) {
        this.className = value;
    }

    /**
     * Gets the value of the attributeList property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the attributeList property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getAttributeList().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Attribute }
     * 
     * 
     */
    public List<Attribute> getAttributeList() {
        if (attributeList == null) {
            attributeList = new ArrayList<Attribute>();
        }
        return this.attributeList;
    }

    /**
     * Gets the value of the queryType property.
     * 
     * @return
     *     possible object is
     *     {@link Query }
     *     
     */
    public Query getQueryType() {
        return queryType;
    }

    /**
     * Sets the value of the queryType property.
     * 
     * @param value
     *     allowed object is
     *     {@link Query }
     *     
     */
    public void setQueryType(Query value) {
        this.queryType = value;
    }

    /**
     * Gets the value of the orderType property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the orderType property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getOrderType().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link Order }
     * 
     * 
     */
    public List<Order> getOrderType() {
        if (orderType == null) {
            orderType = new ArrayList<Order>();
        }
        return this.orderType;
    }

    /**
     * Gets the value of the limit property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getLimit() {
        return limit;
    }

    /**
     * Sets the value of the limit property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setLimit(Long value) {
        this.limit = value;
    }

    /**
     * Gets the value of the offset property.
     * 
     * @return
     *     possible object is
     *     {@link Long }
     *     
     */
    public Long getOffset() {
        return offset;
    }

    /**
     * Sets the value of the offset property.
     * 
     * @param value
     *     allowed object is
     *     {@link Long }
     *     
     */
    public void setOffset(Long value) {
        this.offset = value;
    }

    /**
     * Gets the value of the fullTextQuery property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getFullTextQuery() {
        return fullTextQuery;
    }

    /**
     * Sets the value of the fullTextQuery property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setFullTextQuery(String value) {
        this.fullTextQuery = value;
    }

    /**
     * Gets the value of the cqlQuery property.
     * 
     * @return
     *     possible object is
     *     {@link CqlQuery }
     *     
     */
    public CqlQuery getCqlQuery() {
        return cqlQuery;
    }

    /**
     * Sets the value of the cqlQuery property.
     * 
     * @param value
     *     allowed object is
     *     {@link CqlQuery }
     *     
     */
    public void setCqlQuery(CqlQuery value) {
        this.cqlQuery = value;
    }

}
