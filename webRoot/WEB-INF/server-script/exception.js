function parseErrorMessage(e) {
	var err = $ctx.getChild('error');
	if (err) {
		return err.message;
	}
	if (e.javaException)
		e = e.javaException;
	else
		return e.message;
	while (e && e.getCause && e.getCause())
		e = e.getCause();
	var serviceContext = Packages.aurora.service.ServiceContext
			.createServiceContext($ctx.getData());
	var ed = $instance('aurora.service.exception.IExceptionDescriptor')
	var map = new CompositeMap(ed.process(serviceContext, e));
	return map.message;
}
