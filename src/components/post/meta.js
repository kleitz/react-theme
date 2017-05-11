// External dependencies
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import find from 'lodash/find';

/* eslint no-underscore-dangle: 1 */
class PostMeta extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getTaxonomy(post, taxonomy) {
    if (post === {}) {
      return [];
    }
    const terms = find(post._embedded['wp:term'], item => 
    ((item.constructor === Array) && (typeof item[0] !== 'undefined') && (taxonomy === item[0].taxonomy))
    );
    return terms;
  }

  render() {
    const intl = this.props.intl;
    let categories = this.getTaxonomy(this.props.post, 'category');
    let tags = this.getTaxonomy(this.props.post, 'post_tag');

    if (typeof categories !== 'undefined') {
      categories = categories.map((item, i) => 
        <Link key={i} to={item.link}>{item.name}</Link>
      );
    } else {
      categories = null;
    }

    if (typeof tags !== 'undefined') {
      tags = tags.map((item, i) => (
        <Link key={i} to={item.link}>{item.name}</Link>
      ));
    } else {
      tags = null;
    }

    return (
      <footer className="entry_meta">
        <div className="entry_meta_item">
          <span className="entry_meta_label">{intl.formatMessage({ id: 'post.published' })} </span>
          <time className="entry_meta_value entry_date published updated" dateTime={this.props.post.date}>{this.props.humanDate}</time>
        </div>
        <div className="entry_meta_item">
          {categories ?
            <span>
              <span className="entry_meta_label">{intl.formatMessage({ id: 'post.posted_in' })} </span>
              <span className="entry_meta_value">{categories}</span>
            </span> :
            null
          }
          {categories && tags ?
            <span className="fancy_amp">&amp;</span> :
            null
          }

          {tags ?
            <span>
              <span className="entry_meta_label">{intl.formatMessage({ id: 'post.tagged' })} </span>
              <span className="entry_meta_value">{tags}</span>
            </span> :
            null
          }
        </div>
      </footer>
    );
  }
}

export default PostMeta;

