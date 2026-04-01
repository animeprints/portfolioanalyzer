import api from './api';

export const exportService = {
  async exportPDF(analysisId: string): Promise<void> {
    // For now, use existing client-side PDF export
    // Can extend to server-generated later
    throw new Error('PDF export should use client-side function');
  },

  async exportWord(analysisId: string): Promise<Blob> {
    const response = await api.post('/export', {
      format: 'docx',
      analysis_id: analysisId,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportHTML(analysisId: string): Promise<Blob> {
    const response = await api.post('/export', {
      format: 'html',
      analysis_id: analysisId,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportJSON(analysisId: string): Promise<Blob> {
    const response = await api.post('/export', {
      format: 'json',
      analysis_id: analysisId,
    }, {
      responseType: 'blob',
    });
    return response.data;
  },
};
