from flask import Blueprint, jsonify

from controllers.analytics_controller import AnalyticsController

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')


@analytics_bp.route('/overview', methods=['GET'])
def get_overview():
    response, status_code = AnalyticsController.get_overview()
    return jsonify(response), status_code