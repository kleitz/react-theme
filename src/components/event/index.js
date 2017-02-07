/* global PlasticalSettings */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import DocumentMeta from 'react-document-meta';
import ScrollIntoView from 'scroll-component';

// Internal dependencies
import BodyClass from 'utils/react-body-class';
import QueryEvents from 'wordpress-query-custom-posts-events';
import { getEventIdFromSlug, isRequestingEvent, getEvent } from 'wordpress-query-custom-posts-events/lib/selectors';
import { getTitle, getContent, getFeaturedMedia, getEditLink } from 'utils/content-mixin';

// Components
import EventForm from './form';
import Media from '../post/image';
import Placeholder from 'components/placeholder';

class SingleEvent extends Component {
  renderArticle() {
    const { event, locale, intl } = this.props;
    if (!event) {
      return null;
    }

    const meta = {
      title: `${event.title.rendered} – ${PlasticalSettings.meta.title}`,
      description: event.excerpt.rendered,
      canonical: event.link
    };

    const classes = classNames({
      entry: true
    });
    const featuredMedia = getFeaturedMedia(event);
    const editLink = getEditLink(event, intl.formatMessage({ id: 'content-mixin.edit' }));

    return (
      <article id={`event-${event.id}`} className={classes}>
        <ScrollIntoView id="#container" />          
        <DocumentMeta {...meta} />
        <BodyClass classes={['single', 'single_event']} />
        {featuredMedia ?
          <Media media={featuredMedia} parentClass="entry_image" /> :
          null
        }
        <h1 className="entry_title" dangerouslySetInnerHTML={getTitle(event)} />        
        {intl.formatMessage({ id: 'event.begins' })} 
        <time className="entry_date published startdate" dateTime={event.events_startdate_iso}>
          <em> {event.events_startdate}</em>
        </time><br />
        {intl.formatMessage({ id: 'event.ends' })} 
        <time className="entry_date published enddate" dateTime={event.events_enddate_iso}>
          <em> {event.events_enddate}</em>
        </time>
        <div className="entry_meta" dangerouslySetInnerHTML={editLink} />
        <div className="entry_content" dangerouslySetInnerHTML={getContent(event, intl.formatMessage({ id: 'content-mixin.passprotected' }))} />        
        
      </article>
    );
  }

  renderForm() {
    const { event, locale, intl } = this.props;

    if (!event) {
      return null;
    }

    if (!event.events_attendform) {
      return null;
    }

    return (
      <div>
        <div className="light_sep" />
        <div className="bumper" />
          
        <div className="col620 center clearfix">
          <EventForm 
            locale={this.props.locale} 
            postId={event.id} 
            name={event.title.rendered} 
            startdate={event.events_startdate} 
            deadline={event.events_deadlinedate} 
            deadlineComp={event.events_deadlinedate_comp * 1000}
            intl={intl}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="contents">

        <div className="back">
          <Link className="back_link" to={this.props.intl.formatMessage({ id: 'event.link' })}>
            {this.props.intl.formatMessage({ id: 'event.title' })}
          </Link>
          <div className="lightest_sep" />
        </div>

        <section id="main" className="col780 center clearfix" role="main" aria-live="assertive" tabIndex="-1">
          <QueryEvents eventSlug={this.props.slug} />
          {this.props.loading ?
            <Placeholder type="event" /> :
            this.renderArticle()
          }
        </section>

        {this.renderForm()}

      </div>
    );
  }
}

export default injectIntl(
  connect((state, ownProps) => {
    const locale = state.locale;
    const slug = `${ownProps.params.slug}&lang=${locale.lang}` || false;
    const eventId = getEventIdFromSlug(state, slug);
    const requesting = isRequestingEvent(state, slug);
    const event = getEvent(state, parseInt(eventId));

    return {
      locale,
      slug,
      eventId,
      event,
      requesting,
      loading: requesting && !event
    };
  })(SingleEvent)
);
