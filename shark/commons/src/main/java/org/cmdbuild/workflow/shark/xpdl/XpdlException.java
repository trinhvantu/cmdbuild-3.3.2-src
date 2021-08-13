package org.cmdbuild.workflow.shark.xpdl;

public class XpdlException extends CMProcessDefinitionException {

	private static final long serialVersionUID = -853518722848389606L;

	public XpdlException(Throwable cause) {
		super(cause);
	}

	public XpdlException(String message) {
		super(message);
	}
}
