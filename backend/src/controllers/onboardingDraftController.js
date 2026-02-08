const { OnboardingDraft } = require('../models');

const getDraft = async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'session_required' });
    }

    const draft = await OnboardingDraft.findOne({
      where: { sessionId }
    });

    return res.json({ success: true, data: draft });
  } catch (error) {
    console.error('Get onboarding draft error:', error);
    return res.status(500).json({ success: false, message: 'draft_fetch_failed' });
  }
};

const saveDraft = async (req, res) => {
  try {
    const { sessionId, email, role, data } = req.body || {};
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'session_required' });
    }

    const where = { sessionId };
    const existing = await OnboardingDraft.findOne({ where });

    if (existing) {
      await existing.update({
        sessionId: sessionId || existing.sessionId,
        email: email || existing.email,
        role: role || existing.role,
        data: data || existing.data,
        lastActiveAt: new Date()
      });
      return res.json({ success: true, data: existing });
    }

    const draft = await OnboardingDraft.create({
      sessionId: sessionId || `session_${Date.now()}`,
      email: email || null,
      role: role || null,
      data: data || {},
      lastActiveAt: new Date()
    });

    return res.status(201).json({ success: true, data: draft });
  } catch (error) {
    console.error('Save onboarding draft error:', error);
    return res.status(500).json({ success: false, message: 'draft_save_failed' });
  }
};

module.exports = { getDraft, saveDraft };
