/*
 * Created on 2009-5-15
 */
package aurora.presentation.component;

import aurora.presentation.ViewContext;
import aurora.presentation.markup.TagList;
import uncertain.composite.CompositeMap;
import uncertain.util.template.ITagContent;

public class ViewContextTag implements ITagContent {

	/**
	 * @param viewContext
	 * @param tag
	 */
	public ViewContextTag(ViewContext viewContext, String tag) {
		super();
		mViewContext = viewContext;
		mTag = tag;
	}

	ViewContext mViewContext;
	String mTag;

	public String getContent(CompositeMap context) {
		if (mTag.startsWith("version@")) {
			String version = mTag.substring("version@".length());
			mViewContext.getContextMap().put("version", version);
		}
		Object obj = mViewContext.getContextMap().get(mTag);
		String v=mViewContext.getContextMap().getString("version");
		if (obj instanceof TagList && v != null) {
			return ((TagList) obj).toString(v);
		}
		return obj == null ? "" : obj.toString();
	}

	public String getTag() {
		return mTag;
	}

}
